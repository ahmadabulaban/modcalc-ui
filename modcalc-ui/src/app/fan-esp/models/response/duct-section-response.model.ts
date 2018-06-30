import {FittingResponse} from './fitting-response.model';
import {DampersAndObstructionsResponse} from './dampers-and-obstructions-response.model';
import {DuctMountedEquipmentResponse} from './duct-mounted-equipment-response.model';
import {SpecialComponentResponse} from './special-component-response.model';

export class DuctSectionResponse {
  o1: string;
  o2: string;
  o3: number;
  o4: number;
  o5: number;
  o6: number;
  tx1: string;
  o7: number;
  tx2: string;
  o8: number;
  tx3: string;
  o88: number;
  tx4: string;
  o9: number;
  fittingResponseList: FittingResponse[] = [];
  dampersAndObstructionsResponseList: DampersAndObstructionsResponse[] = [];
  ductMountedEquipmentResponseList: DuctMountedEquipmentResponse[] = [];
  specialComponentResponseList: SpecialComponentResponse[] = [];
  o25: number;
  o26: number;
  o27: number;
  o28: number;

  constructor() {
    this.o1 = null;
    this.o2 = null;
    this.o3 = null;
    this.o4 = null;
    this.o5 = null;
    this.o6 = null;
    this.tx1 = null;
    this.o7 = null;
    this.tx2 = null;
    this.o8 = null;
    this.tx3 = null;
    this.o88 = null;
    this.tx4 = null;
    this.o9 = null;
    this.o25 = null;
    this.o26 = null;
    this.o27 = null;
    this.o28 = null;
    // this.fittingResponseList.push(new FittingResponse());
    // this.dampersAndObstructionsResponseList.push(new DampersAndObstructionsResponse());
    // this.ductMountedEquipmentResponseList.push(new DuctMountedEquipmentResponse());
    // this.specialComponentResponseList.push(new SpecialComponentResponse());
  }
}
