import {Units} from './units.model';
import {AirTemperature} from './air-temperature.model';
import {DuctType} from './duct-type.model';
import {FlowRateAndSizingCriteria} from './flow-rate-and-sizing-criteria.model';

export class DuctSizerRequest {
  units: Units;
  airTemperature: AirTemperature ;
  ductType: DuctType;
  flowRateAndSizingCriteria: FlowRateAndSizingCriteria;
}
