import { AbstractControl, ValidationErrors } from '@angular/forms';

export function twoDecimalPlacesValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '') return null;
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(value) ? null : { decimal: 'two decimal places' };
}
