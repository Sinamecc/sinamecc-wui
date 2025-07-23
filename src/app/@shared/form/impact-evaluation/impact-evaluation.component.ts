import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CATEGORIES_SCALE,
  IMPACT_DIMENSION,
  IMPACT_EVAL_CATEGORIES,
  IMPACT_SCALE,
  IMPACT_SCALE_TERM,
  IMPACT_TYPE,
  OTHER,
} from './constants';

@Component({
  selector: 'app-impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styleUrl: './impact-evaluation.component.scss',
  standalone: false,
})
export class ImpactEvaluationComponent {
  @Input() adaptation: boolean = false;
  @Input() service: any;
  form: UntypedFormGroup;
  selectedCategories: any[][] = [];

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  impactType = IMPACT_TYPE;
  impactDimension = IMPACT_DIMENSION;
  categoriesScale = CATEGORIES_SCALE;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.watchCategorySelection(0);
    this.watchCategorySelection(1);
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          dimensionCtrl: ['', Validators.required],
          categoryGroupCtrl: ['', Validators.required],
          categoryCtrl: ['', Validators.required],
          categoryOtherCtrl: [''],
          descriptionCtrl: this.formBuilder.array([]),
          impactTypeCtrl: ['', Validators.required],
          pertinentCtrl: ['', Validators.required],
          relevantCtrl: ['', Validators.required],
          // quantifiedIndicatorCtrl: ['', Validators.maxLength(200)],
          // baseValueCtrl: ['', Validators.maxLength(70)],
          // expectedValueCtrl: ['', Validators.maxLength(70)],
          // accumulatedValueCtrl: ['', Validators.maxLength(70)],
        }),
        this.formBuilder.group({
          categoryCtrl: ['', Validators.required],
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          descriptionCtrl: this.formBuilder.array([]),
          // quantifiedIndicatorCtrl: ['', Validators.maxLength(200)], // TODO: later version
          // baseValueCtrl: ['', [Validators.minLength(1), Validators.maxLength(70)]],
          // expectedValueCtrl: ['', [Validators.minLength(1), Validators.maxLength(70)]],
          // accumulatedValueCtrl: ['', [Validators.minLength(1), Validators.maxLength(70
        }),
      ]),
    });
  }

  private updateForm() {}

  private getSection(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    return sectionGroup;
  }

  submitForm() {}

  descriptionControls(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    const descriptions = sectionGroup.get('descriptionCtrl') as FormArray;
    return descriptions.controls;
  }

  onSectionOneCategoryChange(event: any) {
    const value = event.value;
    const sectionGroup = this.getSection(0);

    if (value === this.other) {
      sectionGroup?.get('categoryOtherCtrl')?.setValidators([Validators.minLength(1), Validators.maxLength(100)]);
    } else {
      sectionGroup?.get('categoryOtherCtrl')?.setValidators([]);
    }
    sectionGroup?.get('categoryOtherCtrl')?.updateValueAndValidity();
  }

  onCategoryChange(event: any, section: number) {
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

  private watchCategorySelection(section: number) {
    const sectionGroup = this.getSection(section);
    const categoryCtrl = sectionGroup.get('categoryCtrl');
    const descriptionArray = sectionGroup.get('descriptionCtrl') as FormArray;
    categoryCtrl?.valueChanges.subscribe((values: any[]) => {
      this.selectedCategories[section] =
        section === 0
          ? values
          : values.map((val) => this.categoriesScale.find((opt) => opt.value === val)?.name ?? val);
      while (descriptionArray.length > 0) {
        descriptionArray.removeAt(0);
      }

      values?.forEach(() => {
        descriptionArray.push(
          this.formBuilder.group({
            text: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(600)]],
          }),
        );
      });
    });
  }
}
