function createCSVFile (execlib, DynamicFile) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib,
    JobBase = qlib.JobBase;

  function DataSinkStreamer (csvfile, sink, filter, visiblefields, defer) {
    JobBase.call(this, defer);
    this.csvfile = csvfile;
    this.sink = sink;
    this.filter = filter;
    this.visiblefields = visiblefields;
    this.queryID = null;
    this.data = '';
  }
  lib.inherit(DataSinkStreamer, JobBase);
  DataSinkStreamer.prototype.destroy = function () {
    if (this.sink && this.queryID) {
      this.sink.sessionCall('closeQuery', this.queryID);
    }
    this.data = null;
    this.queryID = null;
    this.visiblefields = null;
    this.filter = null;
    this.sink = null;
    this.csvfile = null;
    JobBase.prototype.destroy.call(this);
  };
  DataSinkStreamer.prototype.go = function () {
    if (!this.sink) {
      this.resolve(null);
      return;
    }
    this.sink.sessionCall('query', {singleshot: false, continuous: true, filter: this.filter, visiblefields: this.visiblefields}).then(
      null, this.reject.bind(this), this.onStream.bind(this)
    );
  };
  DataSinkStreamer.prototype.onStream = function (item) {
    if (!lib.isArray(item)) {
      return;
    }
    switch (item[0]) {
      case 'i':
        this.queryID = item[1];
        break;
      case 'r1':
        this.data = this.csvfile.rowProducer(this.sink.recordDescriptor.fields, this.data, item[2]); 
        break;
      case 're':
        this.resolve(this.csvfile.initialString(this.sink.recordDescriptor.fields)+this.data);
        break;
    }
  };

  function CsvFile(filename, destroyables){
    DynamicFile.call(this, filename, destroyables);
  }
  lib.inherit(CsvFile, DynamicFile);
  CsvFile.prototype.contentType = function () {
    return 'text/csv';
  };
  /*
   * datafields: [{
   *  name: 'field0',
   *  title: 'Field0'
   * },{
   *  name: 'field1',
   *  title: 'Field1'
   * }]
   */
  CsvFile.prototype.headerName = function (field) {
    return this.fieldContents(field[this.headerNameTitleName] || field[this.headerNameFieldName]);
  };
  CsvFile.prototype.headerNames = function (datafields) {
    return datafields.map(this.headerName.bind(this)).join(this.fieldDelimiter);
  };
  CsvFile.prototype.streamInFromDataSink = function (sink, filter, visiblefields) {
    var job = new DataSinkStreamer(this, sink, filter, visiblefields), ret = job.defer.promise;
    job.go();
    return ret;
  };
  CsvFile.prototype.initialString = function (datafields) {
    return this.includeHeaders ? this.headerNames(datafields)+'\n' : '';
  };
  CsvFile.prototype.produceFromDataArray = function (datafields, dataarray) {
    var ret = this.initialString(datafields);
    return ret+dataarray.reduce(this.rowProducer.bind(this, datafields), '');
  };
  CsvFile.prototype.rowProducer = function (datafields, res, dataobject) {
    var retobj = {ret: ''};
    datafields.forEach(this.onDataField.bind(this, datafields, dataobject, retobj));
    if (res.length) {
      res += '\n';
    }
    res += retobj.ret;
    retobj = null;
    return res;
  };
  CsvFile.prototype.onDataField = function (datafields, dataobject, retobj, datafield, ind) {
    retobj.ret += this.fieldProducer(dataobject,datafield[this.headerNameFieldName]);
    if (ind < datafields.length-1) {
      retobj.ret += this.fieldDelimiter;
    }
  };
  CsvFile.prototype.fieldProducer = function (dataobject, fieldname) {
    var ret = dataobject[fieldname];
    if (lib.isNumber(ret)) {
      ret+='';
    }
    if (!lib.isString(ret) ) {
      ret = '';
    }
    return this.fieldContents(ret);
  };
  CsvFile.prototype.fieldContents = function (string) {
    if (string.indexOf(this.fieldDelimiter) >= 0) {
      string = this.textDelimiter+string+this.textDelimiter;
    }
    return string;
  };
  CsvFile.prototype.fieldDelimiter = ',';
  CsvFile.prototype.textDelimiter = '"';
  CsvFile.prototype.headerNameFieldName = 'name';
  CsvFile.prototype.headerNameTitleName = 'title';

  return CsvFile;
}

module.exports = createCSVFile;
