import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function requireCategoriesIfOptionsSelected(getOptions: () => any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const options = getOptions();
    const formArray = control as any;

    if (options.length > 0 && formArray.length === 0) {
      return { categoriesRequired: true };
    }
    return null;
  };
}
