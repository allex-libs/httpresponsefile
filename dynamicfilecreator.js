function createDynamicFileSuite(execlib) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q;

  function DynamicFile(filename, destroyables) {
    this.listeners = null;
    if (destroyables) {
      this.listeners = [];
      destroyables.forEach(this.addListenerFor.bind(this));
    }
    this.header = null;
    this.createHeader(filename);
  }
  DynamicFile.prototype.destroy = function () {
    if (this.listeners) {
      lib.arryDestroyAll(this.listeners);
    }
    this.listeners = null;
  };
  DynamicFile.prototype.addListenerFor = function(destroyable) {
    this.listeners.push(destroyable.destroyed.attach(this.destroy.bind(this)));
  };
  DynamicFile.prototype.createHeader = function (filename) {
    this.header = {
      "Content-Type": this.contentType(),
      "Content-Disposition": "attachment; filename=\""+filename+"\";"
    };
  };
  DynamicFile.prototype.getHeaders = function () {
    var h = this.header;
    this.header = null;
    return h ? JSON.stringify(h) : null;
  };
  DynamicFile.prototype.getPayload = function () {
    return null;
  };
  DynamicFile.prototype.contentType = function () {
    throw new lib.Error('NO_CONTENT_TYPE_DEFINED', 'Base DynamicFile class does not implement contentType');
  };

  return DynamicFile;
}

module.exports = createDynamicFileSuite;
