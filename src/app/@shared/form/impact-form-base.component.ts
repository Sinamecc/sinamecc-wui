import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { IMPACT_EVAL_CATEGORIES, IMPACT_SCALE, IMPACT_SCALE_TERM, OTHER } from './constants';

export abstract class ImpactFormBaseComponent {
  form: UntypedFormGroup;

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  categoriesScale = [];

  constructor(protected fb: UntypedFormBuilder) {}

  get formArray(): FormArray {
    return this.form.get('formArray') as FormArray;
  }

  arrayControls(section: number, control: string) {
    const sectionGroup = this.formArray.at(section) as UntypedFormGroup;
    const categories = sectionGroup.get(control) as FormArray;
    return categories.controls;
  }

  protected getSection(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    return sectionGroup;
  }

  onScaleChange(event: any, section: number) {
    const value = event.value;
    const sectionGroup = this.getSection(section);

    if (value === this.impactEvalCategories.SCALE) {
      sectionGroup?.get('impactScaleCtrl')?.setValidators([Validators.required]);
      sectionGroup?.get('impactScaleTermCtrl')?.clearValidators();
    } else if (value === this.impactEvalCategories.SCALE_TERM) {
      sectionGroup?.get('impactScaleCtrl')?.clearValidators();
      sectionGroup?.get('impactScaleTermCtrl')?.setValidators([Validators.required]);
    }
    sectionGroup?.get('impactScaleCtrl')?.updateValueAndValidity();
    sectionGroup?.get('impactScaleTermCtrl')?.updateValueAndValidity();
  }

  addAnotherOption(section: number) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    this.addOtherOption(othersArray);
  }

  protected addOtherOption(othersArray: FormArray) {
    othersArray.push(
      this.fb.group({
        name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(600)]],
        indicator: ['', [Validators.required]],
        indicatorOther: ['', [Validators.maxLength(200)]],
        baseValue: ['', Validators.maxLength(70)],
        expectedValue: ['', Validators.maxLength(70)],
        accumulatedValue: ['', Validators.maxLength(70)],
      }),
    );
  }

  removeOtherOption(index: number, section: number) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    othersArray.removeAt(index);
  }

  onOtherOptionChange(event: any, section: number) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    if (event.includes(this.other) && !othersArray.length) {
      this.addOtherOption(othersArray);
    } else if (!event.includes(this.other)) {
      while (othersArray.length > 0) {
        othersArray.removeAt(0);
      }
    }
  }

  protected watchOptionSelection(section: number) {
    const sectionGroup = this.getSection(section);
    const optionCtrl = sectionGroup.get('optionCtrl');
    const categoriesArray = sectionGroup.get('categoriesCtrl') as FormArray;
    optionCtrl?.valueChanges.subscribe((values: any[]) => {
      while (categoriesArray.length > 0) {
        categoriesArray.removeAt(0);
      }

      values
        ?.filter((value) => value !== this.other)
        .forEach((value) => {
          categoriesArray.push(
            this.fb.group({
              name: [value.name],
              description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(600)]],
              indicator: ['', [Validators.required]],
              indicatorOther: ['', [Validators.maxLength(200)]],
              baseValue: ['', Validators.maxLength(70)],
              expectedValue: ['', Validators.maxLength(70)],
              accumulatedValue: ['', Validators.maxLength(70)],
            }),
          );
        });
    });
  }
}
