export class CalculatorOption {
  key: string;
  value: number;
  defaultOption: boolean;

  constructor(key: string, value: number, defaultOption: boolean) {
    this.key = key;
    this.value = value;
    this.defaultOption = defaultOption;
  }
}
