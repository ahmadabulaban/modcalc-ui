import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';
import {FanEspComponent} from '../fan-esp.component';

@Directive({
  selector: '[ductThicknessInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuctThicknessInputValidator,
      multi: true
    }
  ]
})

export class DuctThicknessInputValidator implements Validator {

  validate(c: AbstractControl): ValidationErrors | null {
    let thickness;
    if (FanEspComponent.uu === 1) {
      thickness = c.value;
    } else {
      thickness = c.value * 25.4;
    }
    const forbidden = (c.value != null && thickness >= 0.1 && thickness <= 5) ? false : true;
    c.markAsUntouched();
    return forbidden ? {'invalidDuctThickness': {value: c.value}} : null;
  }
}
