import {FanEspRequest} from '../request/fan-esp-request.model';

export class FanEspLoadResponse {
  name: string;
  date: string;
  fanEspCalcRequest: FanEspRequest;

  constructor(name: string, date: string, fanEspCalcRequest: FanEspRequest) {
    this.name = name;
    this.date = date;
    this.fanEspCalcRequest = fanEspCalcRequest;
  }
}
