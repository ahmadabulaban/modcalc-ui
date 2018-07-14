import {FanEspCoefficientDataLookupTable} from './fan-esp-coefficient-data-lookup-table.model';

export class FanEspCoefficientDataLookup {
  name: string;
  tables: FanEspCoefficientDataLookupTable[];

  constructor(name: string, tables: FanEspCoefficientDataLookupTable[]) {
    this.name = name;
    this.tables = tables;
  }
}
