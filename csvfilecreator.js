function createCSVFile (execlib, DynamicFile, datamixinlib) {
  'use strict';
  var lib = execlib.lib,
    HttpResponseFileDataMixin = datamixinlib.Mixin,
    ContentsFromDataProducer = HttpResponseFileDataMixin.prototype.ContentsFromDataProducer;

  function CsvFromDataProducer (file, datafields, options) {
    ContentsFromDataProducer.call(this, file, datafields, options);
  }
  lib.inherit(CsvFromDataProducer, ContentsFromDataProducer);
  CsvFromDataProducer.prototype.initialData = function () {
    return (this.file && this.file.includeHeaders) ? this.headerNames() : '';
  };
  CsvFromDataProducer.prototype.headerNames = function () {
    return this.datafields.map(this.file.headerName.bind(this.file)).join(this.file.fieldDelimiter);
  };
  CsvFromDataProducer.prototype.produceRow = function (dataobject) {
    this.addRow(this.datafields.reduce(this.onDataField.bind(this, dataobject), ''));
  };
  CsvFromDataProducer.prototype.onDataField = function (dataobject, result, datafield, ind) {
    result += this.fieldProducer(dataobject,datafield[this.file.headerNameFieldName]);
    if (ind < this.datafields.length-1) {
      result += this.file.fieldDelimiter;
    }
    return result;
  };
  CsvFromDataProducer.prototype.fieldProducer = function (dataobject, fieldname) {
    var ret = dataobject[fieldname];
    if (lib.isNumber(ret)) {
      ret+='';
    }
    if (!lib.isString(ret) ) {
      ret = '';
    }
    return this.file.fieldContents(ret);
  };
  CsvFromDataProducer.prototype.addRow = function (row) {
    if (!lib.isString(row) && row) {
      return;
    }
    if (this.data.length) {
      this.data += '\n';
    }
    this.data += row;
  };

  function CsvFile(filename, destroyables){
    DynamicFile.call(this, filename, destroyables);
    HttpResponseFileDataMixin.call(this);
  }
  lib.inherit(CsvFile, DynamicFile);
  HttpResponseFileDataMixin.addMethods(CsvFile);
  CsvFile.prototype.destroy = function () {
    HttpResponseFileDataMixin.prototype.destroy.call(this);
    DynamicFile.prototype.destroy.call(this);
  };
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
  CsvFile.prototype.fieldContents = function (string) {
    if (string.indexOf(this.fieldDelimiter) >= 0) {
      string = this.textDelimiter+string+this.textDelimiter;
    }
    return string;
  };
  CsvFile.prototype.ContentsFromDataProducer = CsvFromDataProducer;
  CsvFile.prototype.fieldDelimiter = ',';
  CsvFile.prototype.textDelimiter = '"';

  return CsvFile;
}

module.exports = createCSVFile;
