import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
import {FanSystemInteraction} from './models/request/fan-system-interaction.model';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {FanEspCoefficientDataLookupTable} from './models/lookups/fan-esp-coefficient-data-lookup-table.model';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {FanPopupSaveComponent} from './fan-popup-save/fan-popup-save.component';
import {FanEspSaveRequest} from './models/request/fan-esp-save-request.model';
import {FanPopupLoadComponent} from './fan-popup-load/fan-popup-load.component';
import {FanEspLoadResponse} from './models/response/fan-esp-load-response.model';
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-fan-esp',
  templateUrl: './fan-esp.component.html',
  styleUrls: ['./fan-esp.component.css']
})
export class FanEspComponent implements OnInit {
  static uu: number;
  title = 'Fan Esp';
  dataAvailable: boolean;
  resultAvailable: boolean;
  error: boolean;
  errorMessage: string;
  lookupList: Array<FanEspLookup> = [];
  lookupCoefficientList: Array<FanEspCoefficientLookup> = [];
  lookupCoefficientDataList: Array<FanEspCoefficientDataLookup> = [];
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
  response: FanEspResponse = new FanEspResponse();
  // @ViewChild('autosize') autosize: CdkTextareaAutosize;
  //
  // triggerResize() {
  //   // Wait for changes to be applied, then trigger textarea resize.
  //   this.ngZone.onStable.pipe(take(1))
  //     .subscribe(() => this.autosize.resizeToFitContent(true));
  // }
  calculate() {
    let available = false;
    for (const fanSystemInteraction of this.request.fanSystemInteractionList) {
      available = false;
      for (const ductSection of this.request.ductSectionList) {
        if (fanSystemInteraction.ductSection === ductSection.ductSectionId) {
          available = true;
          break;
        }
      }
      if (!available) {
        fanSystemInteraction.ductSection = null;
        fanSystemInteraction.fanSystemInteractionCriteria = 1;
        fanSystemInteraction.fanSystemInteractionDescription = null;
        fanSystemInteraction.ci = null;
      }
    }
    this.fanEspService.calculateFanEsp(this.request)
      .subscribe(resp => {
        this.response = resp;
        this.resultAvailable = true;
        this.error = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, error => {
        this.error = true;
        this.errorMessage = error;
        this.resultAvailable = false;
      });
  }

  saveInput() {
    const dialogRef = this.dialog.open(FanPopupSaveComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const fanEspSaveRequest = new FanEspSaveRequest();
        fanEspSaveRequest.name = result;
        fanEspSaveRequest.fanEspCalcRequest = this.request;
        this.fanEspService.saveFanEsp(fanEspSaveRequest)
          .subscribe(resp => {
            this.error = true;
            this.errorMessage = 'Saved Successfully';
            setTimeout(() => {
              this.error = false;
            }, 3000);
          }, error => {
            this.error = true;
            this.errorMessage = error;
            setTimeout(() => {
              this.error = false;
            }, 3000);
          });
      }
    });
  }

  loadInput() {
    const fanEspLoadResponseList: Array<FanEspLoadResponse> = [];
    this.fanEspService.getSavedFanEsp()
      .subscribe(resp => {
        for (const response of resp) {
          fanEspLoadResponseList.push(new FanEspLoadResponse(response.name,
            response.date, response.fanEspCalcRequest));
        }
      }, error => {
        this.error = true;
        this.errorMessage = 'Unable to load the data';
      }, () => this.openLoadDialog(fanEspLoadResponseList));
  }

  openLoadDialog(fanEspLoadResponseList) {
    const dialogRef = this.dialog.open(FanPopupLoadComponent, {
      data: {fanEspLoadResponseList: fanEspLoadResponseList}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const loadedRequest = fanEspLoadResponseList[result].fanEspCalcRequest;
        const uf = loadedRequest.units.uf;
        const ul = loadedRequest.units.ul;
        this.request = null;
        this.request = loadedRequest;
        this.setRelatedData(loadedRequest.units.uu);
        this.request.units.uf = uf;
        this.request.units.ul = ul;
        this.error = true;
        this.errorMessage = 'Input Successfully Loaded';
        setTimeout(() => {
          this.error = false;
        }, 3000);
      }
    });
  }

  resetAllData() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.request = null;
        this.fillInitialData();
        this.error = true;
        this.errorMessage = 'Reset All Data Successfully';
        setTimeout(() => {
          this.error = false;
        }, 3000);
      }
    });
  }

  backToInputPage() {
    this.resultAvailable = false;
    this.response = null;
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
            , lookupCoefficient.image
            , lookupCoefficient.tableSource
            , lookupCoefficient.fixedHeaderHeight
            , lookupCoefficient.fixedBodyHeight));
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
            , lookupCoefficientData.tables));
        }
      },
      error => {
        this.error = true;
        this.errorMessage = 'Failed to get the initial data !';
      }, () => this.fillInitialData());
  }

  fillInitialData() {
    this.dataAvailable = false;
    this.unitSystemList = [];
    this.flowRateList = [];
    this.lengthList = [];
    this.temperatureUnit = null;
    this.ductMaterialList = [];
    this.ductShapeList = [];
    this.functionList = [];
    this.dimensionUnit = null;
    this.categoryList = [];
    this.pressureUnit = null;
    this.request = new FanEspRequest();
    this.response = new FanEspResponse();
    this.fillUnitSystemList();
    this.fillDuctTypeList();
    this.fillDuctShapeList();
    this.fillFunctionList();
    this.fillCategoryList();
    this.addNewDuctSection();
    this.dataAvailable = true;
  }

  private fillUnitSystemList() {
    for (const lookup of this.lookupList) {
      if (lookup.uiField === 'uu') {
        this.unitSystemList.push(lookup);
      }
    }
    this.request.units.uu = this.unitSystemList[0].value;
    FanEspComponent.uu = this.request.units.uu;
    this.setRelatedData(this.request.units.uu);
  }

  setRelatedData(unitSystem) {
    FanEspComponent.uu = this.request.units.uu;
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
    ductSection.ductSectionId = '';
    if (this.request.ductSectionList.length === 0) {
      ductSection.shp = this.ductShapeList[0].value;
      ductSection.fun = this.functionList[0].value;
    } else {
      ductSection.shp = this.request.ductSectionList[0].shp;
      ductSection.fun = this.request.ductSectionList[0].fun;
      ductSection.ductThicknessInput = this.request.ductSectionList[0].ductThicknessInput;
    }
    ductSection.ductDiameterUnit = this.dimensionUnit.key;
    ductSection.ductWidthUnit = this.dimensionUnit.key;
    ductSection.ductHeightUnit = this.dimensionUnit.key;
    ductSection.ductThicknessUnit = this.dimensionUnit.key;
    this.request.ductSectionList.push(ductSection);
  }

  private removeDuctSection(i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const ductSection = this.request.ductSectionList[i];
        let cnt = 0;
        for (const fanSystemInteraction of this.request.fanSystemInteractionList) {
          if (fanSystemInteraction.ductSection === ductSection.ductSectionId) {
            this.request.fanSystemInteractionList.splice(cnt, 1);
          }
          ++cnt;
        }
        cnt = 0;
        if (this.request.fanSystemInteractionList.length === this.request.ductSectionList.length) {
          for (const fanSystemInteraction of this.request.fanSystemInteractionList) {
            if (fanSystemInteraction.ductSection === null) {
              this.request.fanSystemInteractionList.splice(cnt, 1);
              break;
            }
            cnt++;
          }
        }
        this.request.ductSectionList.splice(i, 1);
      }
    });
  }

  private addFitting(ductSection) {
    const fitting = new Fitting();
    fitting.cat = this.getCategoryList(ductSection.fun)[0].value;
    this.setFittingCriteria(fitting, 1);
    ductSection.fittingList.push(fitting);
  }

  private removeFitting(ductSection, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ductSection.fittingList.splice(i, 1);
      }
    });
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

  private removeDampersAndObstructions(ductSection, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ductSection.dampersAndObstructionsList.splice(i, 1);
      }
    });
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

  private removeEquipment(ductSection, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ductSection.ductMountedEquipmentList.splice(i, 1);
      }
    });
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

  private removeSpecialComponent(ductSection, i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        ductSection.specialComponentList.splice(i, 1);
      }
    });
  }

  getPressureUnit(specialComponent) {
    specialComponent.pressureUnit = this.pressureUnit.key;
    return this.pressureUnit.key;
  }

  getDuctSectionList(i) {
    const tempDuctSectionList: Array<string> = [];
    let anotherDuctSection = null;
    let count = 0;
    for (const fanSystemInteraction of this.request.fanSystemInteractionList) {
      if (count !== i) {
        anotherDuctSection = fanSystemInteraction.ductSection;
        break;
      }
      count++;
    }
    for (const ductSection of this.request.ductSectionList) {
      if (anotherDuctSection !== ductSection.ductSectionId) {
        tempDuctSectionList.push(ductSection.ductSectionId);
      }
    }
    return tempDuctSectionList;
  }

  setFanSystemInteractionCriteria(fanSystemInteraction, tg) {
    if (tg !== fanSystemInteraction.fanSystemInteractionCriteria) {
      fanSystemInteraction.fanSystemInteractionDescription = null;
      fanSystemInteraction.ci = null;
    }
    fanSystemInteraction.fanSystemInteractionCriteria = tg;
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

  removeTerminal(i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.request.airTerminalList.splice(i, 1);
      }
    });
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
            , lookupCoefficient.image
            , lookupCoefficient.tableSource
            , lookupCoefficient.fixedHeaderHeight
            , lookupCoefficient.fixedBodyHeight));
        }
      }
    }
    this.openFittingTypeDialog(fitting, list);
  }

  openFittingTypeDialog(fitting, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        fitting.fittingDescription = result;
        fitting.cf = null;
      }
    });
  }

  chooseFittingCoefficient(fitting) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let tables: FanEspCoefficientDataLookupTable[];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (fitting.fittingDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        tables = lookupCoefficientData.tables;
        break;
      }
    }
    this.openFittingCoefficientDialog(fitting, tables, fanLookupCoefficient);
  }

  openFittingCoefficientDialog(fitting, tables, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      data: {fanLookupCoefficient: fanLookupCoefficient, tables: tables}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        fitting.cf = +result;
      }
    });
  }

  changeFittingCat(fitting) {
    fitting.fittingDescription = null;
    fitting.cf = null;
  }

  changeDampersAndObstructionsValues(dampersAndObstructions) {
    dampersAndObstructions.dampersAndObstructionsDescription = null;
    dampersAndObstructions.cd = null;
  }

  changeDuctMountedEquipmentValues(ductMountedEquipment) {
    ductMountedEquipment.ductMountedEquipmentDescription = null;
    ductMountedEquipment.ce = null;
  }

  changeFanSystemInteractionValues(ductSection) {
    for (const fanSystemInteraction of this.request.fanSystemInteractionList) {
      if (fanSystemInteraction.ductSection === ductSection.startPoint + '-' + ductSection.endPoint) {
        fanSystemInteraction.fanSystemInteractionDescription = null;
        fanSystemInteraction.ci = null;
      }
    }
  }

  changeDuctSectionShp(ductSection) {
    for (const fitting of ductSection.fittingList) {
      this.changeFittingCat(fitting);
    }
    for (const dampersAndObstructions of ductSection.dampersAndObstructionsList) {
      this.changeDampersAndObstructionsValues(dampersAndObstructions);
    }
    for (const ductMountedEquipment of ductSection.ductMountedEquipmentList) {
      this.changeDuctMountedEquipmentValues(ductMountedEquipment);
    }
    this.changeFanSystemInteractionValues(ductSection);
  }

  changeDuctSectionFun(ductSection) {
    for (const fitting of ductSection.fittingList) {
      this.changeFittingCat(fitting);
    }
    this.changeFanSystemInteractionValues(ductSection);
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
            , lookupCoefficient.image
            , lookupCoefficient.tableSource
            , lookupCoefficient.fixedHeaderHeight
            , lookupCoefficient.fixedBodyHeight));
        }
      }
    }
    this.openDampersAndObstructionsTypeDialog(dampersAndObstructions, list);
  }

  openDampersAndObstructionsTypeDialog(dampersAndObstructions, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        dampersAndObstructions.dampersAndObstructionsDescription = result;
        dampersAndObstructions.cd = null;
      }
    });
  }

  chooseDampersAndObstructionsCoefficient(dampersAndObstructions) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let tables: FanEspCoefficientDataLookupTable[];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (dampersAndObstructions.dampersAndObstructionsDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        tables = lookupCoefficientData.tables;
        break;
      }
    }
    this.openDampersAndObstructionsCoefficientDialog(dampersAndObstructions, tables, fanLookupCoefficient);
  }

  openDampersAndObstructionsCoefficientDialog(dampersAndObstructions, tables, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      data: {fanLookupCoefficient: fanLookupCoefficient, tables: tables}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        dampersAndObstructions.cd = +result;
      }
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
    for (const doc of documents) {
      for (const lookupCoefficient of this.lookupCoefficientList) {
        if (doc === lookupCoefficient.documentRelated) {
          list.push(new FanEspCoefficientLookup(lookupCoefficient.name
            , lookupCoefficient.documentRelated
            , lookupCoefficient.typeName
            , lookupCoefficient.document
            , lookupCoefficient.height
            , lookupCoefficient.width
            , lookupCoefficient.image
            , lookupCoefficient.tableSource
            , lookupCoefficient.fixedHeaderHeight
            , lookupCoefficient.fixedBodyHeight));
        }
      }
    }
    this.openDuctMountedEquipmentTypeDialog(ductMountedEquipment, list);
  }

  openDuctMountedEquipmentTypeDialog(ductMountedEquipment, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        ductMountedEquipment.ductMountedEquipmentDescription = result;
        ductMountedEquipment.ce = null;
      }
    });
  }

  chooseDuctMountedEquipmentCoefficient(ductMountedEquipment) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let tables: FanEspCoefficientDataLookupTable[];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (ductMountedEquipment.ductMountedEquipmentDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        tables = lookupCoefficientData.tables;
        break;
      }
    }
    this.openDuctMountedEquipmentCoefficientDialog(ductMountedEquipment, tables, fanLookupCoefficient);
  }

  openDuctMountedEquipmentCoefficientDialog(ductMountedEquipment, tables, fanLookupCoefficient) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      data: {fanLookupCoefficient: fanLookupCoefficient, tables: tables}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        ductMountedEquipment.ce = +result;
      }
    });
  }

  chooseFanSystemInteractionType(fanSystemInteraction) {
    let documentRelated: string;
    let ductSection: DuctSection;
    for (const section of this.request.ductSectionList) {
      if (section.ductSectionId === fanSystemInteraction.ductSection) {
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
            , lookupCoefficient.image
            , lookupCoefficient.tableSource
            , lookupCoefficient.fixedHeaderHeight
            , lookupCoefficient.fixedBodyHeight));
        }
      }
    }
    this.openFanSystemInteractionTypeDialog(fanSystemInteraction, list);
  }

  openFanSystemInteractionTypeDialog(fanSystemInteraction, list) {
    const dialogRef = this.dialog.open(FanPopupTypeComponent, {
      data: {lookupCoefficientDataList: list}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        fanSystemInteraction.fanSystemInteractionDescription = result;
        fanSystemInteraction.ci = null;
      }
    });
  }

  chooseFanSystemInteractionCoefficient(fanSystemInteraction) {
    let fanLookupCoefficient: FanEspCoefficientLookup;
    let tables: FanEspCoefficientDataLookupTable[];
    for (const lookupCoefficient of this.lookupCoefficientList) {
      if (fanSystemInteraction.fanSystemInteractionDescription === lookupCoefficient.typeName) {
        fanLookupCoefficient = lookupCoefficient;
        break;
      }
    }
    for (const lookupCoefficientData of this.lookupCoefficientDataList) {
      if (fanLookupCoefficient.name === lookupCoefficientData.name) {
        tables = lookupCoefficientData.tables;
        break;
      }
    }
    this.openFanSystemInteractionCoefficientDialog(tables, fanLookupCoefficient, fanSystemInteraction);
  }

  openFanSystemInteractionCoefficientDialog(tables, fanLookupCoefficient, fanSystemInteraction) {
    const dialogRef = this.dialog.open(FanPopupCoefficientComponent, {
      data: {fanLookupCoefficient: fanLookupCoefficient, tables: tables}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        fanSystemInteraction.ci = +result;
      }
    });
  }

  addFanSystemInteraction() {
    const fanSystemInteraction = new FanSystemInteraction();
    this.setFanSystemInteractionCriteria(fanSystemInteraction, 1);
    this.request.fanSystemInteractionList.push(fanSystemInteraction);
  }

  removeFanSystemInteraction(i) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.request.fanSystemInteractionList.splice(i, 1);
      }
    });
  }

  setStyleClass(objForm, objField) {
    let styleClass = 'state-success';
    if (objField.invalid && (objField.dirty || objField.touched)) {
      styleClass = 'state-error';
    }
    return styleClass;
  }

  generatePDF() {
    const opt = {
      filename: this.response.project + '_' + this.response.system + '_'
      + this.response.pumpRef + '.pdf',
      image: {type: 'jpeg', quality: 0.98},
      html2canvas: {scale: 2},
      jsPDF: {unit: 'in', format: 'a3', orientation: 'portrait'}
    };
    html2pdf(document.getElementById('reportPdf'), opt);
  }
}
