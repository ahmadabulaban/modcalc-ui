export class FanEspCoefficientDataLookup {
  name: string;
  table: string[][];

  constructor(name: string, table: string[][]) {
    this.name = name;
    this.table = table;
  }
}
