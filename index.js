function createLib (execlib) {
  var DynamicFile = require('./dynamicfilecreator')(execlib),
    CsvFile = require('./csvfilecreator')(execlib, DynamicFile),
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
