import {PumpInformation} from './pump-information.model';
import {Units} from './units.model';
import {AirTemperature} from './air-temperature.model';
import {DuctType} from './duct-type.model';
import {DuctSection} from './duct-section.model';
import {FanSystemInteraction} from './fan-system-interaction.model';
import {AirTerminal} from './air-terminal.model';
import {FanRate} from './fan-rate.model';

export class FanEspRequest {
  pumpInformation: PumpInformation = new PumpInformation();
  units: Units = new Units();
  airTemperature: AirTemperature = new AirTemperature();
  ductType: DuctType = new DuctType();
  ductSectionList: DuctSection[] = [];
  fanSystemInteraction: FanSystemInteraction = null;
  airTerminalList: AirTerminal[] = [];
  fanRate: FanRate = new FanRate();
}
