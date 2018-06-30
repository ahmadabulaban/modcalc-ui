export class FanEspCoefficientLookup {
  name: string;
  documentRelated: string;
  typeName: string;
  document: string;
  height: number;
  width: number;
  image: string;

  constructor(name: string, documentRelated: string, typeName: string, document: string, height: number, width: number, image: string) {
    this.name = name;
    this.documentRelated = documentRelated;
    this.typeName = typeName;
    this.document = document;
    this.height = height;
    this.width = width;
    this.image = image;
  }
}
