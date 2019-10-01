var _expcsv = "Row,Field 1,Field 2\n0,fld1 in row 0,fld2 in row0\n1,fld1 in row 1,fld2 in row1\n2,fld1 in row 2,fld2 in row2\n3,fld1 in row 3,fld2 in row3\n4,fld1 in row 4,fld2 in row4\n5,fld1 in row 5,fld2 in row5\n6,fld1 in row 6,fld2 in row6\n7,fld1 in row 7,fld2 in row7\n8,fld1 in row 8,fld2 in row8\n9,fld1 in row 9,fld2 in row9";

describe('Test CSV file generation', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  loadMochaIntegration('allex_httpresponsefiledatamixinlib');
  HttpResponseFileFromDataTest(function () {
    return Lib.CsvFile;
  }, _expcsv);
});
