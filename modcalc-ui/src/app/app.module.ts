import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './/app-routing.module';
import {DuctSizerComponent} from './duct-sizer/duct-sizer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DuctSizerServiceImpl} from './duct-sizer/service/duct-sizer.serviceImpl';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import { FanEspComponent } from './fan-esp/fan-esp.component';
import {FanEspServiceImpl} from './fan-esp/service/fan-esp.serviceImpl';
import {
  MatButtonModule,
  MatDialogModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { FanPopupTypeComponent } from './fan-esp/fan-popup-type/fan-popup-type.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FanPopupCoefficientComponent } from './fan-esp/fan-popup-coefficient/fan-popup-coefficient.component';

@NgModule({
  declarations: [
    AppComponent,
    DuctSizerComponent,
    FanEspComponent,
    FanPopupTypeComponent,
    FanPopupCoefficientComponent
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
    BrowserAnimationsModule
  ],
  entryComponents: [FanEspComponent, FanPopupTypeComponent, FanPopupCoefficientComponent],
  providers: [HttpClientModule, DuctSizerServiceImpl, FanEspServiceImpl],
  bootstrap: [AppComponent]
})
export class AppModule {
}
