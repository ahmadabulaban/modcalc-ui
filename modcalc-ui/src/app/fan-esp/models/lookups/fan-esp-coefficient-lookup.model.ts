export class FanEspCoefficientLookup {
  name: string;
  documentRelated: string;
  typeName: string;
  document: string;
  height: number;
  width: number;
  image: string;
  tableSource: string;
  fixedHeaderHeight: number[];
  fixedBodyHeight: number[];

  constructor(name: string, documentRelated: string, typeName: string
    , document: string, height: number, width: number, image: string, tableSource: string
    , fixedHeaderHeight: number[], fixedBodyHeight: number[]) {
    this.name = name;
    this.documentRelated = documentRelated;
    this.typeName = typeName;
    this.document = document;
    this.height = height;
    this.width = width;
    this.image = image;
    this.tableSource = tableSource;
    this.fixedHeaderHeight = fixedHeaderHeight;
    this.fixedBodyHeight = fixedBodyHeight;
  }
}
