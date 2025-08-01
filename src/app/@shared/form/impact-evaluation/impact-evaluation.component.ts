import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  CATEGORIES_SCALE,
  IMPACT_DIMENSION,
  IMPACT_EVAL_CATEGORIES,
  IMPACT_EVALUATION,
  IMPACT_SCALE,
  IMPACT_SCALE_TERM,
  IMPACT_TYPE,
  MOCK_CATEGORIES,
  MOCK_CATEGORY_GROUP,
  OTHER,
} from '../constants';
import { Category, SustainableDevelopmentImpactPayload } from '../interface';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { finalize, Observable } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

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
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  item: AdaptationAction | MitigationAction;
  form: UntypedFormGroup;
  loading = false;

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  impactType = IMPACT_TYPE;
  impactDimension = IMPACT_DIMENSION;
  categoriesScale = CATEGORIES_SCALE;
  impactEvaluation = IMPACT_EVALUATION;

  categories = MOCK_CATEGORIES; // TODO: delete
  categoryGroups = MOCK_CATEGORY_GROUP; // TODO: delete

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    if (!this.adaptation) {
      (this.service as MitigationActionsService).currentMitigationAction.subscribe((message) => {
        this.item = message;
      });
    } else {
      (this.service as AdaptationActionService).currentAdaptationActionSource.subscribe((message) => {
        this.item = message;
      });
    }

    this.createForm();
    this.watchCategorySelection(this.impactEvaluation.categories);
    this.watchCategorySelection(this.impactEvaluation.results);
  }

  get categoryGroupsToView(): any[] {
    const selectedDimensions: string[] = this.form?.value?.formArray?.[this.impactEvaluation.categories]?.dimensionCtrl;
    if (!selectedDimensions || selectedDimensions.length === 0) return [];
    return this.categoryGroups.filter((group) => selectedDimensions.includes(group.dimension));
  }

  get categoriesToView(): Category[] {
    const selectedGroupCodes: string[] =
      this.form?.value?.formArray?.[this.impactEvaluation.categories]?.categoryGroupCtrl;
    if (!selectedGroupCodes || selectedGroupCodes.length === 0) return [];
    return this.categories.filter((cat) => selectedGroupCodes.includes(cat.category_group.code));
  }

  get formArray(): FormArray {
    return this.form.get('formArray') as FormArray;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          dimensionCtrl: ['', Validators.required],
          categoryGroupCtrl: ['', Validators.required],
          optionCtrl: ['', Validators.required],
          optionOtherCtrl: this.formBuilder.array([]),
          categoriesCtrl: this.formBuilder.array([]),
          impactTypeCtrl: ['', Validators.required],
          pertinentCtrl: ['', Validators.required],
          relevantCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          optionCtrl: ['', Validators.required],
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
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
      const selectedValues: Category[] = this.form.value.formArray[section].optionCtrl;
      const descriptions: string[] = this.form.value.formArray[section].categoriesCtrl.map((desc: any) => desc.text);

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
        impact_type: this.form.value.formArray[this.impactEvaluation.categories].impactTypeCtrl,
        pertinent: this.form.value.formArray[this.impactEvaluation.categories].pertinentCtrl,
        relevant: this.form.value.formArray[this.impactEvaluation.categories].relevantCtrl,
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
        ? (this.service as AdaptationActionService).updateNewAdaptationAction(payload, this.item.id)
        : (this.service as MitigationActionsService).submitMitigationActionUpdateForm(payload, this.item.id);

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

  arrayControls(section: number, control: string) {
    const sectionGroup = this.formArray.at(section) as UntypedFormGroup;
    const categories = sectionGroup.get(control) as FormArray;
    return categories.controls;
  }

  addAnotherOption(section: number) {
    const sectionGroup = this.getSection(section);
    const othersArray = sectionGroup.get('optionOtherCtrl') as FormArray;
    this.addOtherOption(othersArray);
  }

  addOtherOption(othersArray: FormArray) {
    othersArray.push(
      this.formBuilder.group({
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
            this.formBuilder.group({
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
