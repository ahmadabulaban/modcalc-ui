import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DuctSizerComponent} from './duct-sizer/duct-sizer.component';

const routes: Routes = [
  { path: 'duct-sizer', component: DuctSizerComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule { }
