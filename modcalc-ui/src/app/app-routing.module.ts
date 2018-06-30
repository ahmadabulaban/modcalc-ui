import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DuctSizerComponent} from './duct-sizer/duct-sizer.component';
import {FanEspComponent} from './fan-esp/fan-esp.component';

const routes: Routes = [
  {path: '', redirectTo: 'fan-esp', pathMatch: 'full'},
  {path: 'duct-sizer', component: DuctSizerComponent},
  {path: 'fan-esp', component: FanEspComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule {
}
