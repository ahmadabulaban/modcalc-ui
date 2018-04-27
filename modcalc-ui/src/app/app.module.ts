import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './/app-routing.module';
import {DuctSizerComponent} from './duct-sizer/duct-sizer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DuctSizerService} from './duct-sizer/service/duct-sizer.service';
import {DuctSizerServiceImpl} from './duct-sizer/service/duct-sizer.serviceImpl';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DuctSizerComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [HttpClientModule, DuctSizerServiceImpl],
  bootstrap: [AppComponent]
})
export class AppModule {
}
