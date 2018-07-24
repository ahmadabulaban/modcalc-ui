import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[ductFlowRateInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuctFlowRateInputValidator,
      multi: true
    }
  ]
})

export class DuctFlowRateInputValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    let flowRate;
    flowRate = c.value;
    const forbidden = (c.value != null && flowRate >= 0 && flowRate <= 99999) ? false : true;
    c.markAsUntouched();
    return forbidden ? {'invalidDuctFlowRate': {value: c.value}} : null;
  }
}
