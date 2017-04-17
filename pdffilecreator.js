function createCSVFile (execlib, DynamicFile) {
  'use strict';
  var lib = execlib.lib,
    q = lib.q;

  function PdfFile(filename, destroyables){
    DynamicFile.call(this, filename, destroyables);
  }
  lib.inherit(PdfFile, DynamicFile);
  PdfFile.prototype.contentType = function () {
    return 'application/pdf';
  };

  return PdfFile;
}

module.exports = createCSVFile;
