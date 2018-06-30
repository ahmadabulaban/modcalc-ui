import {Fitting} from './fitting.model';
import {DampersAndObstructions} from './dampers-and-obstructions.model';
import {DuctMountedEquipment} from './duct-mounted-equipment.model';
import {SpecialComponent} from './special-component.model';
import {FanEspLookup} from '../lookups/fan-esp-lookup.model';

export class DuctSection {
  startPoint: string;
  endPoint: string;
  rateInput: number;
  rateUnit: string;
  lengthInput: number;
  lengthUnit: string;
  shp: number;
  fun: number;
  ductDiameterInput: number;
  ductDiameterUnit: string;
  ductWidthInput: number;
  ductWidthUnit: string;
  ductHeightInput: number;
  ductHeightUnit: string;
  ductThicknessInput: number;
  ductThicknessUnit: string;
  fittingList: Fitting[] = [];
  dampersAndObstructionsList: DampersAndObstructions[] = [];
  ductMountedEquipmentList: DuctMountedEquipment[] = [];
  specialComponentList: SpecialComponent[] = [];

  constructor() {
    this.startPoint = null;
    this.endPoint = null;
    this.rateInput = null;
    this.rateUnit = null;
    this.lengthInput = null;
    this.lengthUnit = null;
    this.shp = null;
    this.fun = null;
    this.ductDiameterInput = null;
    this.ductDiameterUnit = null;
    this.ductWidthInput = null;
    this.ductWidthUnit = null;
    this.ductHeightInput = null;
    this.ductHeightUnit = null;
    this.ductThicknessInput = null;
    this.ductThicknessUnit = null;
  }
}
