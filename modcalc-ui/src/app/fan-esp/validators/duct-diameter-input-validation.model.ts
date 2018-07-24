import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';
import {FanEspComponent} from '../fan-esp.component';

@Directive({
  selector: '[ductDiameterInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuctDiameterInputValidator,
      multi: true
    }
  ]
})

export class DuctDiameterInputValidator implements Validator {

  validate(c: AbstractControl): ValidationErrors | null {
    let diameter;
    if (FanEspComponent.uu === 1) {
      diameter = c.value;
    } else {
      diameter = c.value * 25.4;
    }
    const forbidden = (c.value != null && diameter >= 10 && diameter <= 3000) ? false : true;
    c.markAsUntouched();
    return forbidden ? {'invalidDuctDiameter': {value: c.value}} : null;
  }
}
