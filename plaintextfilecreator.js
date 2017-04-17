function createPlainTextFile (execlib, DynamicFile) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q;

  function PlainTextFile(filename, destroyables){
    DynamicFile.call(this, filename, destroyables);
  }
  lib.inherit(PlainTextFile, DynamicFile);
  PlainTextFile.prototype.contentType = function () {
    return 'text/plain';
  };

  return PlainTextFile;
}

module.exports = createPlainTextFile;
