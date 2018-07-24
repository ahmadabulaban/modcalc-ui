import {FanEspRequest} from './fan-esp-request.model';

export class FanEspSaveRequest {
  name: string;
  fanEspCalcRequest: FanEspRequest;

  constructor() {
    this.name = null;
    this.fanEspCalcRequest = null;
  }
}
