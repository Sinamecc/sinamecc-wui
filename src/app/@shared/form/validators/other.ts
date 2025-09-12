import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function requireOtherIfSelected(isOtherSelected: () => boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isOtherSelected()) return null;

    const formArray = control as any;
    if (formArray.length === 0) {
      return { requiredIfOther: true };
    }
    return null;
  };
}
