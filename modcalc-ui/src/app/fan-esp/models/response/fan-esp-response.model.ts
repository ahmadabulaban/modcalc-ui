import {DuctSectionResponse} from './duct-section-response.model';
import {AirTerminalResponse} from './air-terminal-response.model';

export class FanEspResponse {
  project: string;
  system: string;
  pumpRef: string;
  date: string;
  tx5: string;
  ductSectionResponseList: DuctSectionResponse[] = [];
  o29: string;
  o30: number;
  o31: number;
  o32: number;
  o33: number;
  o34: number;
  o35: number;
  o36: number;
  o37: number;
  airTerminalResponseList: AirTerminalResponse[] = [];
  o42: number;
  o43: number;
  o44: number;

  constructor() {
    this.project = null;
    this.system = null;
    this.pumpRef = null;
    this.date = null;
    this.tx5 = null;
    this.o29 = null;
    this.o30 = null;
    this.o31 = null;
    this.o32 = null;
    this.o33 = null;
    this.o34 = null;
    this.o35 = null;
    this.o36 = null;
    this.o37 = null;
    this.o42 = null;
    this.o43 = null;
    this.o44 = null;
    // this.ductSectionResponseList.push(new DuctSectionResponse());
    // this.airTerminalResponseList.push(new AirTerminalResponse());
    // this.ductSectionResponseList.push(new DuctSectionResponse());
  }
}
