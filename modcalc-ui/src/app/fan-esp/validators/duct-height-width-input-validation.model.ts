import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';
import {FanEspComponent} from '../fan-esp.component';

@Directive({
  selector: '[ductHeightWidthInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuctHeightWidthInputValidator,
      multi: true
    }
  ]
})

export class DuctHeightWidthInputValidator implements Validator {

  validate(c: AbstractControl): ValidationErrors | null {
    let dimension;
    if (FanEspComponent.uu === 1) {
      dimension = c.value;
    } else {
      dimension = c.value * 25.4;
    }
    const forbidden = (c.value != null && dimension >= 10 && dimension <= 4000) ? false : true;
    c.markAsUntouched();
    return forbidden ? {'invalidDuctDimension': {value: c.value}} : null;
  }
}
