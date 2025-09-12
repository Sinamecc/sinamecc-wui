import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators, FormGroup } from '@angular/forms';
import { getCategoriesScaleByCode, IMPACT_EVAL_CATEGORIES, IMPACT_SCALE, IMPACT_SCALE_TERM, OTHER } from './constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export abstract class ImpactEvaluationComponent {
  destroy$ = new Subject<void>();
  form: UntypedFormGroup;
  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  categoriesScale: {
    code: string;
    name: string;
  }[] = [];

  constructor(protected fb: UntypedFormBuilder) {}

  get formArray(): FormArray {
    return this.form.get('formArray') as FormArray;
  }

  hasImpactEvalCategory(values: any[], code: string) {
    return values.some((value) => value.code === code);
  }

  arrayControls(section: number, control: string) {
    const sectionGroup = this.getSection(section);
    const categories = sectionGroup.get(control) as FormArray;
    return categories.controls;
  }

  protected getSection(section: number) {
    const sectionGroup = this.formArray.at(section) as UntypedFormGroup;
    return sectionGroup;
  }

  compareCategory = (o1: any, o2: any): boolean => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  onScaleChange(event: any[], section: number): void {
    this.applyScaleValidators(section, event);
    this.changeValidators(section);
  }

  private applyScaleValidators(section: number, selectedOptions: any[]): void {
    const sectionGroup = this.formArray.at(section) as FormGroup;
    const impactScaleCtrl = sectionGroup.get('impactScaleCtrl');
    const impactScaleTermCtrl = sectionGroup.get('impactScaleTermCtrl');

    const selectedCodes = selectedOptions.map((opt) => opt.code);

    const hasScale = selectedCodes.includes(this.impactEvalCategories.SCALE);
    const hasScaleTerm = selectedCodes.includes(this.impactEvalCategories.SCALE_TERM);

    if (hasScale) {
      impactScaleCtrl?.setValidators([Validators.required]);
    } else {
      impactScaleCtrl?.clearValidators();
    }

    if (hasScaleTerm) {
      impactScaleTermCtrl?.setValidators([Validators.required]);
    } else {
      impactScaleTermCtrl?.clearValidators();
    }

    impactScaleCtrl?.updateValueAndValidity();
    impactScaleTermCtrl?.updateValueAndValidity();
  }

  addAnotherOption(section: number, barrier: boolean = false) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    this.addOtherOption(othersArray, barrier);
  }

  protected addOtherOption(othersArray: FormArray, barrier: boolean = false) {
    const groupConfig = barrier
      ? {
          description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(600)]],
        }
      : {
          name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
          description: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(600)]],
          indicator: ['', [Validators.required]],
          indicatorOther: ['', [Validators.maxLength(200)]],
          baseValue: ['', Validators.maxLength(70)],
          expectedValue: ['', Validators.maxLength(70)],
          accumulatedValue: ['', Validators.maxLength(70)],
        };
    othersArray.push(this.fb.group(groupConfig));
  }

  protected isOtherSelected(section: number): boolean {
    const sectionGroup = this.getSection(section);
    const selectedOptions = sectionGroup.get('optionCtrl')?.value || [];
    return selectedOptions.includes(this.other);
  }

  protected getSelectedOptions(section: number): any[] {
    const sectionGroup = this.getSection(section);
    return sectionGroup.get('optionCtrl')?.value || [];
  }

  protected addCategoryIndicator(section: number, values?: any, control: string = 'categoriesCtrl') {
    const sectionGroup = this.getSection(section);
    const array = sectionGroup.get(control) as FormArray;

    const groupConfig = values?.barrier
      ? {
          code: [values?.code || ''],
          name: [values?.name || ''],
          description: [
            values?.description || '',
            [Validators.required, Validators.minLength(50), Validators.maxLength(600)],
          ],
        }
      : {
          id: [values?.id || ''],
          code: [values?.code || ''],
          name: [values?.name || ''],
          description: [
            values?.description || '',
            [Validators.required, Validators.minLength(50), Validators.maxLength(600)],
          ],
          indicator: [values?.indicator || '', [Validators.required]],
          indicatorOther: [values?.indicatorOther || '', [Validators.maxLength(200)]],
          baseValue: [values?.baseValue || '', Validators.maxLength(70)],
          expectedValue: [values?.expectedValue || '', Validators.maxLength(70)],
          accumulatedValue: [values?.accumulatedValue || '', Validators.maxLength(70)],
        };
    array.push(this.fb.group(groupConfig));
  }

  removeOtherOption(index: number, section: number) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    othersArray.removeAt(index);
  }

  changeValidators(section: number) {
    const sectionGroup = this.getSection(section);
    sectionGroup.get('optionOtherCtrl')?.updateValueAndValidity();
    sectionGroup.get('categoriesCtrl')?.updateValueAndValidity();
  }

  onOptionChange(event: any, section: number, barrier: boolean = false) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    if (event.includes(this.other) && !othersArray.length) {
      this.addOtherOption(othersArray, barrier);
    } else if (!event.includes(this.other)) {
      while (othersArray.length > 0) {
        othersArray.removeAt(0);
      }
    }
    this.changeValidators(section);
  }

  protected patchResults(results: any[], adaptation: boolean, section: number): void {
    const sectionGroup = this.formArray.at(section) as FormGroup;
    if (!results?.length) return;

    const result = results[0];
    const optionCtrl = sectionGroup.get('optionCtrl');
    const impactScaleCtrl = sectionGroup.get('impactScaleCtrl');
    const impactScaleTermCtrl = sectionGroup.get('impactScaleTermCtrl');

    const options: any[] = [];

    result.scale.forEach((scale: any) => {
      this.addCategoryIndicator(section, {
        id: scale.id,
        code: scale.code,
        name: scale.name,
        description: scale.description,
        indicator: scale.indicator?.id,
        indicatorOther: scale.indicator?.name,
        baseValue: scale.base_value,
        expectedValue: scale.expected_value,
        accumulatedValue: scale.accumulated_value,
      });

      if (scale.category_result) {
        const codes = scale.category_result.map((cr: any) => cr.code);

        if (scale.category_result.some((cr: any) => cr.name === 'SCALE')) {
          impactScaleCtrl?.setValue(codes);
          options.push(getCategoriesScaleByCode(adaptation, this.impactEvalCategories.SCALE));
        }

        if (scale.category_result.some((cr: any) => cr.name === 'SCALE_TERM')) {
          impactScaleTermCtrl?.setValue(codes);
          options.push(getCategoriesScaleByCode(adaptation, this.impactEvalCategories.SCALE_TERM));
        }
      }
    });

    optionCtrl?.setValue(options);

    this.applyScaleValidators(section, options);
  }

  protected watchOptionSelection(section: number, barrier?: boolean) {
    const sectionGroup = this.getSection(section);
    const optionCtrl = sectionGroup.get('optionCtrl');
    const categoriesArray = sectionGroup.get('categoriesCtrl') as FormArray;
    optionCtrl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((values: any[]) => {
      const selected = values?.filter((value) => value !== this.other);
      selected.forEach((value) => {
        const exists = categoriesArray.value.some((cat: any) => {
          return barrier
            ? cat.code?.toString() === value.code?.toString()
            : cat.id?.toString() === value.id?.toString();
        });
        if (!exists) {
          if (barrier) {
            this.addCategoryIndicator(section, {
              code: value.code,
              name: value.name,
              barrier: barrier,
            });
          } else {
            this.addCategoryIndicator(section, {
              id: value.id,
              code: value.code,
              name: value.name,
            });
          }
        }
      });

      for (let i = categoriesArray.length - 1; i >= 0; i--) {
        const cat = categoriesArray.at(i).value;
        const stillSelected = selected.some((v) => v.code === cat.code);
        if (!stillSelected) {
          categoriesArray.removeAt(i);
        }
      }
    });
  }
}
