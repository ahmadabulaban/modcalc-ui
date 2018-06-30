export class FanEspLookup {
  uiField: string;
  key: string;
  value: number;
  defaultOption: boolean;
  group: number;

  constructor(uiField: string, key: string, value: number, defaultOption: boolean, group: number) {
    this.uiField = uiField;
    this.key = key;
    this.value = value;
    this.defaultOption = defaultOption;
    this.group = group;
  }
}
