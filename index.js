function createLib (execlib) {
  'use strict';
  return execlib.loadDependencies('client', ['allex:httpresponsefiledatamixin:lib'], libCreator.bind(null, execlib));
}

function libCreator (execlib, datamixinlib) {
  'use strict';
  var DynamicFile = require('./dynamicfilecreator')(execlib),
    CsvFile = require('./csvfilecreator')(execlib, DynamicFile, datamixinlib),
    PdfFile = require('./pdffilecreator')(execlib, DynamicFile),
    PlainTextFile = require('./plaintextfilecreator')(execlib, DynamicFile),
    StreamingFile = require('./streamingfilecreator')(execlib, DynamicFile);

  return {
    DynamicFile: DynamicFile,
    CsvFile: CsvFile,
    PdfFile: PdfFile,
    PlainTextFile: PlainTextFile,
    StreamingFile: StreamingFile
  }
}

module.exports = createLib;
