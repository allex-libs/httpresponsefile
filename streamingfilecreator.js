function createStreamingFile (execlib, DynamicFile) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q;

  function StreamingFile(filename, content_type, destroyables){
    DynamicFile.call(this, filename, destroyables);
    this.content_type = content_type;
    this.buffer = new Buffer(0);
    this.closed = false;
  }
  lib.inherit(StreamingFile, DynamicFile);
  StreamingFile.prototype.destroy = function () {
    this.buffer = null;
    this.content_type = null;
    this.closed = null;
    DynamicFile.prototype.destroy.call(this);
  };


  StreamingFile.prototype.contentType = function () {
    return this.content_type;
  };

  StreamingFile.prototype.addBuffer = function (buff) {
    this.buffer = Buffer.concat([this.buffer, buff]);
  };

  StreamingFile.prototype.close = function () {
    //console.log('will close the streaming file..');
    this.closed = true;
  };

  StreamingFile.prototype._doDestroy = function () {
    lib.runNext(this.destroy.bind(this));
    return null;
  };

  StreamingFile.prototype.getPayload = function () {
    if (!this.buffer) {
      return this._doDestroy();
    }
    var b = this.buffer;
    if (this.closed) {
      this.buffer = null;
      if (!b.length) {
        return this._doDestroy();
      }
    }else{
      this.buffer = new Buffer(0);
    }
    return b;
  };
  return StreamingFile;
}

module.exports = createStreamingFile;
