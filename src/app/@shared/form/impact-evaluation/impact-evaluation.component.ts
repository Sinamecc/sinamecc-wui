import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CATEGORIES_SCALE,
  IMPACT_DIMENSION,
  IMPACT_EVAL_CATEGORIES,
  IMPACT_SCALE,
  IMPACT_SCALE_TERM,
  IMPACT_TYPE,
  MOCK_CATEGORIES,
  MOCK_CATEGORY_GROUP,
  OTHER,
} from '../constants';
import { Category, SustainableDevelopmentImpactPayload } from './interface';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { finalize, Observable } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styleUrl: './impact-evaluation.component.scss',
  standalone: false,
})
export class ImpactEvaluationComponent {
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() state = new EventEmitter<States>();
  @Input() stepper: any;
  @Input() id: string;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  form: UntypedFormGroup;
  selectedCategories: string[][] = [];
  loading = false;

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  impactType = IMPACT_TYPE;
  impactDimension = IMPACT_DIMENSION;
  categoriesScale = CATEGORIES_SCALE;

  categories = MOCK_CATEGORIES; // TODO: delete
  categoryGroups = MOCK_CATEGORY_GROUP; // TODO: delete

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.createForm();
    this.watchCategorySelection(0);
    this.watchCategorySelection(1);
  }

  get categoryGroupsToView(): any[] {
    const selectedDimensions: string[] = this.form?.value?.formArray?.[0]?.dimensionCtrl;
    if (!selectedDimensions || selectedDimensions.length === 0) return [];
    return this.categoryGroups.filter((group) => selectedDimensions.includes(group.dimension));
  }

  get categoriesToView(): Category[] {
    const selectedGroupCodes: string[] = this.form?.value?.formArray?.[0]?.categoryGroupCtrl;
    if (!selectedGroupCodes || selectedGroupCodes.length === 0) return [];
    return this.categories.filter((cat) => selectedGroupCodes.includes(cat.category_group.code));
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
          // accumulatedValueCtrl: ['', [Validators.minLength(1), Validators.maxLength(70)],
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

  buildCategoryPayload() {
    let categories: Category[] = [];
    for (let section = 0; section < this.form.value.formArray.length; section++) {
      const selectedValues: Category[] = this.form.value.formArray[section].categoryCtrl;
      const descriptions: string[] = this.form.value.formArray[section].descriptionCtrl.map((desc: any) => desc.text);

      categories = selectedValues.map((value, index) => ({
        ...value,
        description: descriptions[index],
      }));
    }
    return categories;
  }

  buildPayload() {
    const payload: { sustainable_development_impact: SustainableDevelopmentImpactPayload } = {
      sustainable_development_impact: {
        category: this.buildCategoryPayload(),
        impact_type: this.form.value.formArray[0].impactTypeCtrl,
        pertinent: this.form.value.formArray[0].pertinentCtrl,
        relevant: this.form.value.formArray[0].relevantCtrl,
        result: '',
      },
    };
    return payload;
  }

  submitForm() {
    if (this.loading) return;
    this.loading = true;
    const payload = this.buildPayload();
    const observable: Observable<any> =
      this.service instanceof AdaptationActionService
        ? (this.service as AdaptationActionService).updateNewAdaptationAction(payload, this.id)
        : (this.service as MitigationActionsService).submitMitigationActionUpdateForm(payload, this.id);

    observable
      .pipe(
        finalize(() => {
          this.loading = false;
          this.form?.markAsPristine();
        }),
      )
      .subscribe({
        next: (response) => {
          if (this.service instanceof AdaptationActionService) {
            (this.service as AdaptationActionService).updateCurrentAdaptationAction(
              Object.assign(response.body, payload),
            );
          } else {
            (this.service as MitigationActionsService).updateCurrentMitigationAction(
              Object.assign(response.body, payload),
            );
          }

          this.state.emit(response.state as States);
          this.onComplete?.emit(true);

          this.translateService.get('form.success').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });

          this.stepper?.next();
        },

        error: (error) => {
          this.translateService.get('errorLabel.errorProcessing').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
        },
      });
  }

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
      this.selectedCategories[section] = values.map((value) => value.name);
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
