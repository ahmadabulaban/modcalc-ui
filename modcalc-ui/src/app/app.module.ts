import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './/app-routing.module';
import {DuctSizerComponent} from './duct-sizer/duct-sizer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DuctSizerServiceImpl} from './duct-sizer/service/duct-sizer.serviceImpl';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {FanEspComponent} from './fan-esp/fan-esp.component';
import {FanEspServiceImpl} from './fan-esp/service/fan-esp.serviceImpl';
import {
  MatButtonModule,
  MatDialogModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatProgressBarModule, MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {FanPopupTypeComponent} from './fan-esp/fan-popup-type/fan-popup-type.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FanPopupCoefficientComponent} from './fan-esp/fan-popup-coefficient/fan-popup-coefficient.component';
import {TemperatureInputValidator} from './fan-esp/validators/temperature-input-validation.model';
import {DuctFlowRateInputValidator} from './fan-esp/validators/duct-flow-rate-input-validation.model';
import {NullInputValidator} from './fan-esp/validators/null-input-validation.model';
import {DuctLengthInputValidator} from './fan-esp/validators/duct-length-input-validation.model';
import {DuctDiameterInputValidator} from './fan-esp/validators/duct-diameter-input-validation.model';
import {DuctHeightWidthInputValidator} from './fan-esp/validators/duct-height-width-input-validation.model';
import {DuctThicknessInputValidator} from './fan-esp/validators/duct-thickness-input-validation.model';
import {ConfirmationDialogComponent} from './fan-esp/confirmation-dialog/confirmation-dialog.component';
import {FanPopupSaveComponent} from './fan-esp/fan-popup-save/fan-popup-save.component';
import { FanPopupLoadComponent } from './fan-esp/fan-popup-load/fan-popup-load.component';

@NgModule({
  declarations: [
    AppComponent,
    DuctSizerComponent,
    FanEspComponent,
    FanPopupTypeComponent,
    FanPopupCoefficientComponent,
    TemperatureInputValidator,
    DuctFlowRateInputValidator,
    NullInputValidator,
    DuctLengthInputValidator,
    DuctDiameterInputValidator,
    DuctHeightWidthInputValidator,
    DuctThicknessInputValidator,
    ConfirmationDialogComponent,
    FanPopupSaveComponent,
    FanPopupLoadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  entryComponents: [FanEspComponent, FanPopupTypeComponent, FanPopupCoefficientComponent
    , ConfirmationDialogComponent, FanPopupSaveComponent, FanPopupLoadComponent],
  providers: [HttpClientModule, DuctSizerServiceImpl, FanEspServiceImpl],
  bootstrap: [AppComponent]
})
export class AppModule {
}
