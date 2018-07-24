import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[ductLengthInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuctLengthInputValidator,
      multi: true
    }
  ]
})

export class DuctLengthInputValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    let length;
    length = c.value;
    const forbidden = (c.value != null && length >= 0 && length <= 99999) ? false : true;
    c.markAsUntouched();
    return forbidden ? {'invalidDuctLength': {value: c.value}} : null;
  }
}
