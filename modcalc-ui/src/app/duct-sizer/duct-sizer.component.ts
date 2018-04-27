import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {isNull} from 'util';
import {FlowRateAndSizingCriteria} from './models/flow-rate-and-sizing-criteria.model';
import {AirTemperature} from './models/air-temperature.model';
import {Units} from './models/units.model';
import {DuctType} from './models/duct-type.model';
import {DuctSizerRequest} from './models/duct-sizer-request.model';
import {DuctSizerServiceImpl} from './service/duct-sizer.serviceImpl';
import {DuctSizingLookupData} from './models/duct-sizing-lookup-data.model';

@Component({
  selector: 'app-duct-sizer',
  templateUrl: './duct-sizer.component.html',
  styleUrls: ['./duct-sizer.component.css']
})
export class DuctSizerComponent implements OnInit {
  title = 'Duct Sizer';
  lookupDataList: Array<DuctSizingLookupData> = [];
  ductSizerForm: FormGroup;
  unitSystemList: Array<DuctSizingLookupData> = [];
  flowRateList: Array<DuctSizingLookupData> = [];
  temperatureUnit: DuctSizingLookupData;
  dimensionUnit: DuctSizingLookupData;
  ductMaterialList: Array<DuctSizingLookupData> = [];
  ductShapeList: Array<DuctSizingLookupData> = [];
  pressureUnit: DuctSizingLookupData;
  velocityUnit: DuctSizingLookupData;
  error: boolean;
  dataAvailable: boolean;
  units: Units;
  airTemperature: AirTemperature;
  ductType: DuctType;
  flowRateAndSizingCriteria: FlowRateAndSizingCriteria;
  ductSizerRequest: DuctSizerRequest;
  errorMessage: string;

  constructor(private titleService: Title, private formBuilder: FormBuilder, private ductSizerService: DuctSizerServiceImpl) {
    this.titleService.setTitle(this.title);
    this.ductSizerForm = this.formBuilder.group({
      unitSystem: DuctSizingLookupData,
      flowRate: DuctSizingLookupData,
      temperatureInput: ['', [Validators.required]],
      ductMaterial: DuctSizingLookupData,
      ductThickness: ['', [Validators.required]],
      flowRateInput: ['', [Validators.required]],
      ductShape: DuctSizingLookupData,
      dimensionInput: null,
      sizingCriteria: 0,
      allowedPressureInput: null,
      allowedVelocityInput: null,
      o1: '',
      tx1: '',
      o2: '',
      tx2: '',
      o3: '',
      o4: '',
      tx3: '',
      o5: '',
      tx5: '',
      o6: '',
      tx6: '',
    });
  }

  ngOnInit() {
    this.dataAvailable = false;
    this.error = false;
    this.getLookupData();
  }

  getLookupData() {
    this.ductSizerService.getDuctSizerLookupData().subscribe(
      data => {
        for (const lookupData of data) {
          this.lookupDataList.push(new DuctSizingLookupData(lookupData.uiField, lookupData.key,
            lookupData.value, lookupData.defaultOption, lookupData.group));
        }
        this.dataAvailable = true;
      },
      error => {
        this.error = true;
        this.errorMessage = 'Failed to get the initial data !';
      },
      () => this.fillInitialData());
  }

  fillInitialData() {
    this.fillUnitSystemList();
    this.fillDuctTypeList();
    this.fillDuctShapeList();
    this.setRelatedData(this.unitSystemList[0]);
  }

  calculate() {
    if (!this.ductSizerForm.valid ||
      (this.ductSizerForm.controls.ductShape.value.value === 1
        && isNull(this.ductSizerForm.controls.dimensionInput.value)) ||
      ((this.ductSizerForm.controls.sizingCriteria.value + 1) === 1
        && isNull(this.ductSizerForm.controls.allowedPressureInput.value)) ||
      ((this.ductSizerForm.controls.sizingCriteria.value + 1) === 2
        && isNull(this.ductSizerForm.controls.allowedVelocityInput.value))) {
      this.error = true;
      this.errorMessage = 'Please fill all fields !';
      this.clearAllResultValues();
      return;
    }
    this.error = false;
    this.mapToUnits();
    this.mapToAirTemperature();
    this.mapToDuctType();
    this.mapToFlowRateAndSizingCriteria();
    this.mapToDuctSizerRequest();

    this.ductSizerService.calculateDuctSizer(this.ductSizerRequest)
      .subscribe(resp => {
        this.ductSizerForm.patchValue({o1: resp.o1});
        this.ductSizerForm.patchValue({tx1: resp.tx1});
        this.ductSizerForm.patchValue({o2: resp.o2});
        this.ductSizerForm.patchValue({tx2: resp.tx2});
        this.ductSizerForm.patchValue({o3: resp.o3});
        this.ductSizerForm.patchValue({o4: resp.o4});
        this.ductSizerForm.patchValue({tx3: resp.tx3});
        this.ductSizerForm.patchValue({o5: resp.o5});
        this.ductSizerForm.patchValue({tx5: resp.tx5});
        this.ductSizerForm.patchValue({o6: resp.o6});
        this.ductSizerForm.patchValue({tx6: resp.tx6});
      }, error => {
        this.error = true;
        this.errorMessage = error;
        this.clearAllResultValues();
      });
  }

  private clearAllResultValues() {
    this.ductSizerForm.patchValue({o1: ''});
    this.ductSizerForm.patchValue({tx1: ''});
    this.ductSizerForm.patchValue({o2: ''});
    this.ductSizerForm.patchValue({tx2: ''});
    this.ductSizerForm.patchValue({o3: ''});
    this.ductSizerForm.patchValue({o4: ''});
    this.ductSizerForm.patchValue({tx3: ''});
    this.ductSizerForm.patchValue({o5: ''});
    this.ductSizerForm.patchValue({tx5: ''});
    this.ductSizerForm.patchValue({o6: ''});
    this.ductSizerForm.patchValue({tx6: ''});
  }

  private mapToDuctSizerRequest() {
    this.ductSizerRequest = new DuctSizerRequest();
    this.ductSizerRequest.units = this.units;
    this.ductSizerRequest.airTemperature = this.airTemperature;
    this.ductSizerRequest.ductType = this.ductType;
    this.ductSizerRequest.flowRateAndSizingCriteria = this.flowRateAndSizingCriteria;
  }

  private mapToFlowRateAndSizingCriteria() {
    this.flowRateAndSizingCriteria = new FlowRateAndSizingCriteria();
    this.flowRateAndSizingCriteria.rateInput = this.ductSizerForm.controls.flowRateInput.value;
    this.flowRateAndSizingCriteria.rateUnit = this.ductSizerForm.controls.flowRate.value.key;
    this.flowRateAndSizingCriteria.shp = this.ductSizerForm.controls.ductShape.value.value;
    if (this.flowRateAndSizingCriteria.shp === 1) {
      this.flowRateAndSizingCriteria.dimensionInput = this.ductSizerForm.controls.dimensionInput.value;
    } else {
      this.flowRateAndSizingCriteria.dimensionInput = null;
    }
    this.flowRateAndSizingCriteria.sizingCriteria = (this.ductSizerForm.controls.sizingCriteria.value + 1);
    if (this.flowRateAndSizingCriteria.sizingCriteria === 1) {
      this.flowRateAndSizingCriteria.allowedPressureInput = this.ductSizerForm.controls.allowedPressureInput.value;
      this.flowRateAndSizingCriteria.pressureUnit = this.pressureUnit.key;
      this.flowRateAndSizingCriteria.allowedVelocityInput = null;
      this.flowRateAndSizingCriteria.velocityUnit = null;
    }
    if (this.flowRateAndSizingCriteria.sizingCriteria === 2) {
      this.flowRateAndSizingCriteria.allowedVelocityInput = this.ductSizerForm.controls.allowedVelocityInput.value;
      this.flowRateAndSizingCriteria.velocityUnit = this.velocityUnit.key;
      this.flowRateAndSizingCriteria.allowedPressureInput = null;
      this.flowRateAndSizingCriteria.pressureUnit = null;
    }
  }

  private mapToDuctType() {
    this.ductType = new DuctType();
    this.ductType.eps = this.ductSizerForm.controls.ductMaterial.value.value;
    this.ductType.thicknessInput = this.ductSizerForm.controls.ductThickness.value;
    this.ductType.dimensionUnit = this.dimensionUnit.key;
  }

  private mapToAirTemperature() {
    this.airTemperature = new AirTemperature();
    this.airTemperature.temperatureInput = this.ductSizerForm.controls.temperatureInput.value;
    this.airTemperature.temperatureUnit = this.temperatureUnit.key;
  }

  private mapToUnits() {
    this.units = new Units();
    this.units.uu = this.ductSizerForm.controls.unitSystem.value.value;
    this.units.uf = this.ductSizerForm.controls.flowRate.value.value;
  }

  private fillUnitSystemList() {
    for (const lookupData of this.lookupDataList) {
      if (lookupData.uiField === 'uu') {
        this.unitSystemList.push(lookupData);
      }
    }
    this.ductSizerForm.controls.unitSystem.setValue(this.unitSystemList[0]);
  }

  private fillDuctShapeList() {
    for (const lookupData of this.lookupDataList) {
      if (lookupData.uiField === 'ductShape') {
        this.ductShapeList.push(lookupData);
      }
    }
    this.ductSizerForm.controls.ductShape.setValue(this.ductShapeList[0]);
  }

  private fillDuctTypeList() {
    for (const lookupData of this.lookupDataList) {
      if (lookupData.uiField === 'eps') {
        this.ductMaterialList.push(lookupData);
      }
    }
    this.ductSizerForm.controls.ductMaterial.setValue(this.ductMaterialList[0]);
  }

  setRelatedData(unitSystem) {
    this.flowRateList = [];
    for (const lookupData of this.lookupDataList) {
      if (lookupData.uiField === 'uf' && lookupData.group === unitSystem.value) {
        this.flowRateList.push(lookupData);
      }
      if (lookupData.uiField === 'temperatureUnit' && lookupData.group === unitSystem.value) {
        this.temperatureUnit = lookupData;
      }
      if (lookupData.uiField === 'dimensionUnit' && lookupData.group === unitSystem.value) {
        this.dimensionUnit = lookupData;
      }
      if (lookupData.uiField === 'pressureUnit' && lookupData.group === unitSystem.value) {
        this.pressureUnit = lookupData;
      }
      if (lookupData.uiField === 'velocityUnit' && lookupData.group === unitSystem.value) {
        this.velocityUnit = lookupData;
      }
    }
    this.ductSizerForm.controls.flowRate.setValue(this.flowRateList[0]);
  }
}
