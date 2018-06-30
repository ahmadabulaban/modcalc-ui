import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FanEspServiceImpl} from './service/fan-esp.serviceImpl';
import {FanEspLookup} from './models/lookups/fan-esp-lookup.model';
import {DuctSection} from './models/request/duct-section.model';
import {Fitting} from './models/request/fitting.model';
import {FanEspRequest} from './models/request/fan-esp-request.model';
import {DampersAndObstructions} from './models/request/dampers-and-obstructions.model';
import {DuctMountedEquipment} from './models/request/duct-mounted-equipment.model';
import {SpecialComponent} from './models/request/special-component.model';
import {AirTerminal} from './models/request/air-terminal.model';
import {MatDialog} from '@angular/material';
import {FanPopupTypeComponent} from './fan-popup-type/fan-popup-type.component';
import {FanEspCoefficientLookup} from './models/lookups/fan-esp-coefficient-lookup.model';
import {FanEspCoefficientDataLookup} from './models/lookups/fan-esp-coefficient-data-lookup.model';
import {FanPopupCoefficientComponent} from './fan-popup-coefficient/fan-popup-coefficient.component';
import {FanEspResponse} from './models/response/fan-esp-response.model';

@Component({
  selector: 'app-fan-esp',
  templateUrl: './fan-esp.component.html',
  styleUrls: ['./fan-esp.component.css']
})
export class FanEspComponent implements OnInit {
  title = 'Fan Esp';
  dataAvailable: boolean;
  resultAvailable: boolean;
  error: boolean;
  errorMessage: string;
  lookupList: Array<FanEspLookup> = [];
  unitSystemList: Array<FanEspLookup> = [];
  flowRateList: Array<FanEspLookup> = [];
  lengthList: Array<FanEspLookup> = [];
  temperatureUnit: FanEspLookup;
  ductMaterialList: Array<FanEspLookup> = [];
  ductShapeList: Array<FanEspLookup> = [];
  functionList: Array<FanEspLookup> = [];
  dimensionUnit: FanEspLookup;
  categoryList: Array<FanEspLookup> = [];
  pressureUnit: FanEspLookup;
  request: FanEspRequest = new FanEspRequest();
  lookupCoefficientList: Array<FanEspCoefficientLookup> = [];
  lookupCoefficientDataList: Array<FanEspCoefficientDataLookup> = [];
  fanSystemInteractionDuctSection: number;
  response: FanEspResponse = new FanEspResponse();

  calculate() {
    console.log(this.request);
    this.request.fanSystemInteraction.ductSection
      = this.request.ductSectionList[this.fanSystemInteractionDuctSection].startPoint
      + ':' + this.request.ductSectionList[this.fanSystemInteractionDuctSection].endPoint;
    this.fanEspService.calculateFanEsp(this.request)
      .subscribe(resp => {
        this.response = resp;
        this.resultAvailable = true;
      }, error => {
        this.error = true;
        this.errorMessage = error;
        this.resultAvailable = false;
      });
  }

  backToInputPage() {
    this.resultAvailable = false;
    this.response = new FanEspResponse();
  }

  constructor(private titleService: Title, private fanEspService: FanEspServiceImpl, public dialog: MatDialog) {
    this.titleService.setTitle(this.title);
  }

  ngOnInit() {
    this.resultAvailable = false;
    this.dataAvailable = false;
    this.error = false;
    this.getLookup();
  }

  getLookup() {
    this.fanEspService.getFanEspLookup().subscribe(
      data => {
        for (const lookup of data) {
          this.lookupList.push(new FanEspLookup(lookup.uiField, lookup.key,
            lookup.value, lookup.defaultOption, lookup.group));
        }
      },
      error => {
        this.error = true;
        this.errorMessage = 'Failed to get the initial data !';
      },
      () => this.getLookupCoefficient());
  }

  getLookupCoefficient() {
    this.fanEspService.getFanEspCoefficientLookup().subscribe(
      data => {
        for (const lookupCoefficient of data) {
          this.lookupCoefficientList.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image));
        }
      },
      error => {
        this.error = true;
        this.errorMessage = 'Failed to get the initial data !';
      }, () => this.getLookupCoefficientData());
  }

  getLookupCoefficientData() {
    this.fanEspService.getFanEspCoefficientDataLookup().subscribe(
      data => {
        for (const lookupCoefficientData of data) {
          this.lookupCoefficientDataList.push(new FanEspCoefficientDataLookup(lookupCoefficientData.name
            , lookupCoefficientData.table));
        }
      },
      error => {
        this.error = true;
        this.errorMessage = 'Failed to get the initial data !';
      }, () => this.fillInitialData());
  }

  fillInitialData() {
    this.fillUnitSystemList();
    this.fillDuctTypeList();
    this.fillDuctShapeList();
    this.fillFunctionList();
    this.fillCategoryList();
    this.addNewDuctSection();
    this.fanSystemInteractionDuctSection = 0;
    this.request.fanSystemInteraction.ductSection
      = this.request.ductSectionList[0].startPoint + ':' + this.request.ductSectionList[0].endPoint;
    this.setFanSystemInteractionCriteria(1);
    this.addTerminal();
    this.dataAvailable = true;
  }

  private fillUnitSystemList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'uu') {
        this.unitSystemList.push(lookup);
      }
    }
    this.request.units.uu = this.unitSystemList[0].value;
    this.setRelatedData(this.request.units.uu);
  }

  setRelatedData(unitSystem) {
    this.flowRateList = [];
    this.lengthList = [];
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'uf' && lookup.group === unitSystem) {
        this.flowRateList.push(lookup);
      }
      if (lookup.uiField === 'temperatureUnit' && lookup.group === unitSystem) {
        this.temperatureUnit = lookup;
      }
      if (lookup.uiField === 'ul' && lookup.group === unitSystem) {
        this.lengthList.push(lookup);
      }
      if (lookup.uiField === 'dimensionUnit' && lookup.group === unitSystem) {
        this.dimensionUnit = lookup;
      }
      if (lookup.uiField === 'pressureUnit' && lookup.group === unitSystem) {
        this.pressureUnit = lookup;
      }
    }
    this.request.units.uf = this.flowRateList[0].value;
    this.request.units.ul = this.lengthList[0].value;
    this.request.airTemperature.temperatureUnit = this.temperatureUnit.key;
    // this.callAllValidation();
  }

  getFlowRateKey(uf, ductSection) {
    for (const flowRate of this.flowRateList) {
      if (flowRate.value === uf) {
        ductSection.rateUnit = flowRate.key;
        return flowRate.key;
      }
    }
  }

  getLengthKey(ul, ductSection) {
    for (const length of this.lengthList) {
      if (length.value === ul) {
        ductSection.lengthUnit = length.key;
        return length.key;
      }
    }
  }

  getDimensionUnit(ductSection) {
    ductSection.ductDiameterUnit = this.dimensionUnit.key;
    ductSection.ductWidthUnit = this.dimensionUnit.key;
    ductSection.ductHeightUnit = this.dimensionUnit.key;
    ductSection.ductThicknessUnit = this.dimensionUnit.key;
    return this.dimensionUnit.key;
  }

  private fillDuctTypeList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'eps') {
        this.ductMaterialList.push(lookup);
      }
    }
    this.request.ductType.eps = this.ductMaterialList[0].value;
  }

  private fillDuctShapeList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'shp') {
        this.ductShapeList.push(lookup);
      }
    }
  }

  private fillFunctionList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'fun') {
        this.functionList.push(lookup);
      }
    }
  }

  private fillCategoryList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'cat') {
        this.categoryList.push(lookup);
      }
    }
  }

  getCategoryList(fun) {
    const tempCatList: Array<FanEspLookup> = [];
    for (const category of this.categoryList) {
      if (category.group === fun) {
        tempCatList.push(category);
      }
    }
    return tempCatList;
  }

  private addNewDuctSection() {
    const ductSection = new DuctSection();
    ductSection.startPoint = '';
    ductSection.endPoint = '';
    ductSection.shp = this.ductShapeList[0].value;
    ductSection.fun = this.functionList[0].value;
    ductSection.ductDiameterUnit = this.dimensionUnit.key;
    ductSection.ductWidthUnit = this.dimensionUnit.key;
    ductSection.ductHeightUnit = this.dimensionUnit.key;
    ductSection.ductThicknessUnit = this.dimensionUnit.key;
    this.request.ductSectionList.push(ductSection);
  }

  private removeDuctSection() {
    if (this.fanSystemInteractionDuctSection === this.request.ductSectionList.length - 1) {
      this.fanSystemInteractionDuctSection = 0;
      this.request.fanSystemInteraction.ductSection
        = this.request.ductSectionList[0].startPoint + ':' + this.request.ductSectionList[0].endPoint;
    }
    this.request.ductSectionList.pop();
  }

  private addFitting(ductSection) {
    const fitting = new Fitting();
    fitting.cat = this.getCategoryList(ductSection.fun)[0].value;
    this.setFittingCriteria(fitting, 1);
    ductSection.fittingList.push(fitting);
  }

  private removeFitting(ductSection) {
    ductSection.fittingList.pop();
  }

  setFittingCriteria(fitting, tg) {
    if (tg !== fitting.fittingSizingCriteria) {
      fitting.fittingDescription = null;
      fitting.cf = null;
      fitting.qf = null;
    }
    fitting.fittingSizingCriteria = tg;
  }

  private addDampersAndObstructions(ductSection) {
    const dampersAndObstructions = new DampersAndObstructions();
    this.setDampersAndObstructionsCriteria(dampersAndObstructions, 1);
    ductSection.dampersAndObstructionsList.push(dampersAndObstructions);
  }

  private removeDampersAndObstructions(ductSection) {
    ductSection.dampersAndObstructionsList.pop();
  }

  setDampersAndObstructionsCriteria(dampersAndObstructions, tg) {
    if (tg !== dampersAndObstructions.dampersAndObstructionsSizingCriteria) {
      dampersAndObstructions.dampersAndObstructionsDescription = null;
      dampersAndObstructions.cd = null;
      dampersAndObstructions.qd = null;
    }
    dampersAndObstructions.dampersAndObstructionsSizingCriteria = tg;
  }

  private addEquipment(ductSection) {
    const ductMountedEquipment = new DuctMountedEquipment();
    this.setDuctMountedEquipmentCriteria(ductMountedEquipment, 1);
    ductSection.ductMountedEquipmentList.push(ductMountedEquipment);
  }

  private removeEquipment(ductSection) {
    ductSection.ductMountedEquipmentList.pop();
  }

  setDuctMountedEquipmentCriteria(ductMountedEquipment, tg) {
    if (tg !== ductMountedEquipment.ductMountedEquipmentCriteria) {
      ductMountedEquipment.ductMountedEquipmentDescription = null;
      ductMountedEquipment.ce = null;
      ductMountedEquipment.qe = null;
    }
    ductMountedEquipment.ductMountedEquipmentCriteria = tg;
  }

  private addSpecialComponent(ductSection) {
    const specialComponent = new SpecialComponent();
    ductSection.specialComponentList.push(specialComponent);
  }

  private removeSpecialComponent(ductSection) {
    ductSection.specialComponentList.pop();
  }

  getPressureUnit(specialComponent) {
    specialComponent.pressureUnit = this.pressureUnit.key;
    return this.pressureUnit.key;
  }

  getDuctSectionList() {
    const tempDuctSectionList: Array<string> = [];
    for (const ductSection of this.request.ductSectionList) {
      tempDuctSectionList.push(ductSection.startPoint + ':' + ductSection.endPoint);
    }
    return tempDuctSectionList;
  }

  setFanSystemInteractionCriteria(tg) {
    if (tg !== this.request.fanSystemInteraction.fanSystemInteractionCriteria) {
      this.request.fanSystemInteraction.fanSystemInteractionDescription = null;
      this.request.fanSystemInteraction.ci = null;
    }
    this.request.fanSystemInteraction.fanSystemInteractionCriteria = tg;
  }

  getTerminalRateUnit(uf, airTerminal) {
    for (const flowRate of this.flowRateList) {
      if (flowRate.value === uf) {
        airTerminal.terminalRateUnit = flowRate.key;
        return flowRate.key;
      }
    }
  }

  getTerminalPressureUnit(airTerminal) {
    airTerminal.terminalPressureUnit = this.pressureUnit.key;
    return this.pressureUnit.key;
  }

  addTerminal() {
    const airTerminal = new AirTerminal();
    this.getTerminalRateUnit(this.request.units.uf, airTerminal);
    this.getTerminalPressureUnit(airTerminal);
    this.request.airTerminalList.push(airTerminal);
  }

  removeTerminal() {
    this.request.airTerminalList.pop();
  }

  getFanRateUnit(uf) {
    for (const flowRate of this.flowRateList) {
      if (flowRate.value === uf) {
        this.request.fanRate.fanRateUnit = flowRate.key;
        return flowRate.key;
      }
    }
  }

  chooseFittingType(ductSection, fitting) {
    let documentRelated: string;
    const group = ductSection.shp * 100 + ductSection.fun * 10 + fitting.cat;
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'fittingDescription' && lookup.group === group) {
        documentRelated = lookup.key;
        break;
      }
    }
    const list: Array<FanEspCoefficientLookup> = [];
    const documents = documentRelated.split(',');
    for (const doc of documents) {
      for (const lookupCoefficient of this.lookupCoefficientList) {
        if (doc === lookupCoefficient.documentRelated) {
          list.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image));
        }
      }
    }
    this.openFittingTypeDialog(fitting, list);
  }

  openFittingTypeDialog(fitting, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      // width: '700px',
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      fitting.fittingDescription = result;
    });
  }

  chooseFittingCoefficient(fitting) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let table: string[][];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (fitting.fittingDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        table = lookupCoefficientData.table;
        break;
      }
    }
    this.openFittingCoefficientDialog(fitting, table, fanLookupCoefficient);
  }

  openFittingCoefficientDialog(fitting, table, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      // width: '700px',
      data: {fanLookupCoefficient: fanLookupCoefficient, table: table}
    });
    dialogRef.afterClosed().subscribe(result => {
      fitting.cf = +result;
    });
  }

  changeFittingCat(fitting) {
    fitting.fittingDescription = null;
    fitting.cf = null;
  }

  changeDuctSectionShpFun(ductSection) {
    for (const fitting of ductSection.fittingList) {
      this.changeFittingCat(fitting);
    }
  }

  chooseDampersAndObstructionsType(ductSection, dampersAndObstructions) {
    let documentRelated: string;
    const group = ductSection.shp;
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'dampersAndObstructionsDescription' && lookup.group === group) {
        documentRelated = lookup.key;
        break;
      }
    }
    const list: Array<FanEspCoefficientLookup> = [];
    const documents = documentRelated.split(',');
    for (const doc of documents) {
      for (const lookupCoefficient of this.lookupCoefficientList) {
        if (doc === lookupCoefficient.documentRelated) {
          list.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image));
        }
      }
    }
    this.openDampersAndObstructionsTypeDialog(dampersAndObstructions, list);
  }

  openDampersAndObstructionsTypeDialog(dampersAndObstructions, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      // width: '700px',
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      dampersAndObstructions.dampersAndObstructionsDescription = result;
    });
  }

  chooseDampersAndObstructionsCoefficient(dampersAndObstructions) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let table: string[][];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (dampersAndObstructions.dampersAndObstructionsDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        table = lookupCoefficientData.table;
        break;
      }
    }
    this.openDampersAndObstructionsCoefficientDialog(dampersAndObstructions, table, fanLookupCoefficient);
  }

  openDampersAndObstructionsCoefficientDialog(dampersAndObstructions, table, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      // width: '700px',
      data: {fanLookupCoefficient: fanLookupCoefficient, table: table}
    });
    dialogRef.afterClosed().subscribe(result => {
      dampersAndObstructions.cd = +result;
    });
  }

  chooseDuctMountedEquipmentType(ductSection, ductMountedEquipment) {
    let documentRelated: string;
    const group = ductSection.shp;
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'ductMountedEquipmentDescription' && lookup.group === group) {
        documentRelated = lookup.key;
        break;
      }
    }
    const list: Array<FanEspCoefficientLookup> = [];
    const documents = documentRelated.split(',');
    console.log(documents);
    for (const doc of documents) {
      for (const lookupCoefficient of this.lookupCoefficientList) {
        if (doc === lookupCoefficient.documentRelated) {
          list.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image));
        }
      }
    }
    this.openDuctMountedEquipmentTypeDialog(ductMountedEquipment, list);
  }

  openDuctMountedEquipmentTypeDialog(ductMountedEquipment, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      // width: '700px',
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      ductMountedEquipment.ductMountedEquipmentDescription = result;
    });
  }

  chooseDuctMountedEquipmentCoefficient(ductMountedEquipment) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let table: string[][];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (ductMountedEquipment.ductMountedEquipmentDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        table = lookupCoefficientData.table;
        break;
      }
    }
    this.openDuctMountedEquipmentCoefficientDialog(ductMountedEquipment, table, fanLookupCoefficient);
  }

  openDuctMountedEquipmentCoefficientDialog(ductMountedEquipment, table, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      // width: '700px',
      data: {fanLookupCoefficient: fanLookupCoefficient, table: table}
    });
    dialogRef.afterClosed().subscribe(result => {
      ductMountedEquipment.ce = +result;
    });
  }

  //

  chooseFanSystemInteractionType() {
    let documentRelated: string;
    let ductSection: DuctSection;
    this.request.fanSystemInteraction.ductSection = this.request.ductSectionList[this.fanSystemInteractionDuctSection].startPoint
      + ':' + this.request.ductSectionList[this.fanSystemInteractionDuctSection].endPoint;
    for (const section of this.request.ductSectionList) {
      if (section.startPoint + ':' + section.endPoint === this.request.fanSystemInteraction.ductSection) {
        ductSection = section;
        break;
      }
    }
    const group = ductSection.shp * 10 + ductSection.fun;
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'fanSystemInteractionDescription' && lookup.group === group) {
        documentRelated = lookup.key;
        break;
      }
    }
    const list: Array<FanEspCoefficientLookup> = [];
    const documents = documentRelated.split(',');
    for (const doc of documents) {
      for (const lookupCoefficient of this.lookupCoefficientList) {
        if (doc === lookupCoefficient.documentRelated) {
          list.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image));
        }
      }
    }
    this.openFanSystemInteractionTypeDialog(list);
  }

  openFanSystemInteractionTypeDialog(list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      // width: '700px',
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.request.fanSystemInteraction.fanSystemInteractionDescription = result;
    });
  }

  chooseFanSystemInteractionCoefficient() {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let table: string[][];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (this.request.fanSystemInteraction.fanSystemInteractionDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        table = lookupCoefficientData.table;
        break;
      }
    }
    this.openFanSystemInteractionCoefficientDialog(table, fanLookupCoefficient);
  }

  openFanSystemInteractionCoefficientDialog(table, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      // width: '700px',
      data: {fanLookupCoefficient: fanLookupCoefficient, table: table}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.request.fanSystemInteraction.ci = +result;
    });
  }

  setFanSystemInteractionDuctSection() {
    for (let i = 0; i < this.request.ductSectionList.length; ++i) {
      const section = this.request.ductSectionList[i];
      if (this.request.fanSystemInteraction.ductSection === section.startPoint + ':' + section.endPoint) {
        this.fanSystemInteractionDuctSection = i;
        break;
      }
    }
  }

  setStyleClass(objForm, objField) {
    let styleClass = 'state-success';
    if (objField.invalid && (objField.dirty || objField.touched)) {
      styleClass = 'state-error';
    }
    return styleClass;
  }
}
