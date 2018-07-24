import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive({
  selector: '[nullInputValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NullInputValidator,
      multi: true
    }
  ]
})

export class NullInputValidator implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    let v;
    v = c.value;
    c.markAsUntouched();
    if (v === null || v === '') {
      return {'nullValue': {value: 'null'}};
    } else {
      return null;
    }
  }
}
