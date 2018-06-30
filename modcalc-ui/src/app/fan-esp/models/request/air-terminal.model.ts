export class AirTerminal {
  airTerminalDescription: string;
  model: string;
  terminalRateInput: number;
  terminalRateUnit: string;
  terminalPressureDropInput: number;
  terminalPressureUnit: string;

  constructor() {
    this.airTerminalDescription = null;
    this.model = null;
    this.terminalRateInput = null;
    this.terminalRateUnit = null;
    this.terminalPressureDropInput = null;
    this.terminalPressureUnit = null;
  }
}
