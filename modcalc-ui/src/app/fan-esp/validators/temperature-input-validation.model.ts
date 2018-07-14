import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';
import {FanEspComponent} from '../fan-esp.component';

@Directive({
  selector: '[temperatureInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: TemperatureInputValidator,
      multi: true
    }
  ]
})

export class TemperatureInputValidator implements Validator {

  validate(c: AbstractControl): ValidationErrors | null {
    let temperature;
    if (FanEspComponent.uu === 1) {
      temperature = c.value;
    } else {
      temperature = (c.value - 32) / 1.8;
    }
    const forbidden = (c.value != null && temperature >= -20 && temperature <= 100) ? false : true;
    return forbidden ? {'invalidTemperature': {value: c.value}} : null;
  }
}
