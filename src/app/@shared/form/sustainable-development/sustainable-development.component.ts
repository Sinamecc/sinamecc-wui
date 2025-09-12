import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { getCategoriesScale, IMPACT_EVALUATION, IMPACT_TYPE, OTHER } from '../constants';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { finalize, Observable, switchMap, takeUntil } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactEvaluationComponent } from '../impact-evaluation.component';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { getImpactEvalCategoryKey } from '../utils';
import { Category, CategoryGroup, CategoryOptionResult, Dimension } from '../types/results';
import { SustainableDevelopmentImpactPayload } from '../types/payload';
import { requireOtherIfSelected } from '../validators/other';
import { requireCategoriesIfOptionsSelected } from '../validators/categories';

@Component({
  selector: 'app-sustainable-development',
  templateUrl: './sustainable-development.component.html',
  styleUrl: './sustainable-development.component.scss',
  standalone: false,
})
export class SustainableDevelopmentComponent extends ImpactEvaluationComponent {
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() state = new EventEmitter<States>();
  @Input() stepper: any;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  item: AdaptationAction | MitigationAction;
  form: UntypedFormGroup;
  loading = false;

  impactType = IMPACT_TYPE;
  impactEvaluation = IMPACT_EVALUATION;

  dimensions: Dimension[] = [];
  categories: { category: string; items: Category[] }[] = [];
  categoryGroups: { dimension: string; items: CategoryGroup[] }[] = [];
  section = this.impactEvaluation;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private impactService: ImpactEvaluationService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    super(formBuilder);
  }

  ngOnInit() {
    if (!this.adaptation) {
      (this.service as MitigationActionsService).currentMitigationAction
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.item = message;
        });
    } else {
      (this.service as AdaptationActionService).currentAdaptationActionSource
        .pipe(takeUntil(this.destroy$))
        .subscribe((message) => {
          this.item = message;
        });
    }

    this.createForm();
    if ((this.item.category_option as CategoryOptionResult)?.id) {
      this.updateForm();
    }
    this.applyConditionalValidators();
    this.watchOptionSelection(this.section.categories);
    this.watchOptionSelection(this.section.results, this.IS_CODE_SEARCH);
    this.categoriesScale = getCategoriesScale(this.adaptation);
    this.loadDimensions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDimensions() {
    this.impactService
      .getDimensions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dimensions: Dimension[]) => {
        this.dimensions = dimensions;
      });
  }

  onDimensionChange(event: any) {
    if (!event || event.length === 0) {
      this.categoryGroups = [];
      this.categories = [];
      this.formArray?.get([this.section.categories])?.get('categoryGroupCtrl')?.setValue([]);
      this.formArray?.get([this.section.categories])?.get('optionCtrl')?.setValue([]);
      return;
    }

    this.impactService
      .getCategoryGroupsByDimensions({
        dimension_list: event.map((code: string) => ({ code_dimension: code })),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((groups: CategoryGroup[]) => {
        const grouped = this.groupOptions(groups);
        this.categoryGroups = Object.entries(grouped).map(([dimension, items]) => ({
          dimension,
          items: items as CategoryGroup[],
        }));
        this.formArray?.get([this.section.categories])?.get('categoryGroupCtrl')?.setValue([]);
        this.categories = [];
        this.formArray?.get([this.section.categories])?.get('optionCtrl')?.setValue([]);
      });
  }

  onCategoryGroupChange(event: CategoryGroup[]) {
    if (!event || event.length === 0) {
      this.categories = [];
      this.formArray?.get([this.section.categories])?.get('optionCtrl')?.setValue([]);
      return;
    }

    this.impactService
      .getCategoriesByCategoryGroups({
        category_group_list: event.map((category: CategoryGroup) => ({
          code_category_group: category.code,
          code_dimension: category.dimension.code,
        })),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: Category[]) => {
        const grouped = this.groupOptions(categories);
        this.categories = Object.entries(grouped).map(([category, items]) => ({
          category,
          items: items as Category[],
        }));
        this.formArray?.get([this.section.categories])?.get('optionCtrl')?.setValue([]);
      });
  }

  groupOptions(options: (CategoryGroup | Category)[]) {
    const grouped: { [key: string]: (CategoryGroup | Category)[] } = {};

    options.forEach((item) => {
      let groupName: string;
      if ('dimension' in item && item.dimension) {
        groupName = item.dimension.name;
      } else if ('category_group' in item && item.category_group) {
        groupName = item.category_group.name;
      } else {
        groupName = 'general.other';
      }
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(item);
    });

    return grouped;
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        // categories
        this.formBuilder.group({
          dimensionCtrl: ['', Validators.required],
          categoryGroupCtrl: [[], Validators.required],
          optionCtrl: [[], Validators.required],
          optionOtherCtrl: this.formBuilder.array([]),
          categoriesCtrl: this.formBuilder.array([]),
          impactTypeCtrl: ['', Validators.required],
          pertinentCtrl: ['', Validators.required],
          relevantCtrl: ['', Validators.required],
        }),
        // results
        this.formBuilder.group({
          optionCtrl: [[], Validators.required],
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
        }),
      ]),
    });
  }

  private applyConditionalValidators(): void {
    const categoriesGroup = this.formArray.at(this.section.categories);
    const resultsGroup = this.formArray.at(this.section.results);

    const optionOtherCtrl = categoriesGroup.get('optionOtherCtrl') as FormArray;
    optionOtherCtrl.setValidators([requireOtherIfSelected(() => this.isOtherSelected(this.section.categories))]);
    optionOtherCtrl.updateValueAndValidity();

    const categoriesCtrl = categoriesGroup.get('categoriesCtrl') as FormArray;
    categoriesCtrl.setValidators([
      requireCategoriesIfOptionsSelected(() => this.getSelectedOptions(this.section.categories)),
    ]);
    categoriesCtrl.updateValueAndValidity();

    const resultsCategoriesCtrl = resultsGroup.get('categoriesCtrl') as FormArray;
    resultsCategoriesCtrl.setValidators([
      requireCategoriesIfOptionsSelected(() => this.getSelectedOptions(this.section.results)),
    ]);
    resultsCategoriesCtrl.updateValueAndValidity();
  }

  public updateForm() {
    if (this.item.category_option) {
      this.patchCategoryOption(this.item.category_option);
    }
    if (this.item.result) {
      this.patchResults(this.item.result, this.adaptation, this.section.results);
    }
  }

  private patchCategoryOption(categoryOption: any) {
    const sectionGroup = this.formArray.at(this.section.categories) as FormGroup;
    const category = categoryOption.category_section.map((cat) => cat.category);
    const categoryGroup = category.map((cat) => cat.category_group);
    const dimension = categoryGroup.map((cat) => cat.dimension);
    const dimensionCodes = dimension.map((dimension) => dimension.code);
    const hasOthers = categoryOption.other.length;

    this.impactService
      .getCategoryGroupsByDimensions({
        dimension_list: dimensionCodes.map((code) => ({ code_dimension: code })),
      })
      .pipe(
        switchMap((groups) => {
          const groupedGroups = this.groupOptions(groups);
          this.categoryGroups = Object.entries(groupedGroups).map(([dimension, items]) => ({
            dimension,
            items: items as CategoryGroup[],
          }));
          sectionGroup.get('categoryGroupCtrl').patchValue(categoryGroup);
          return this.impactService.getCategoriesByCategoryGroups({
            category_group_list: categoryGroup.map((cat) => ({
              code_category_group: cat.code,
              code_dimension: cat.dimension.code,
            })),
          });
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((categories) => {
        const groupedCategories = this.groupOptions(categories);
        this.categories = Object.entries(groupedCategories).map(([category, items]) => ({
          category,
          items: items as Category[],
        }));
        if (hasOthers) category.push(OTHER);
        sectionGroup.get('optionCtrl')?.patchValue(category);
      });

    sectionGroup.patchValue({
      dimensionCtrl: dimensionCodes,
      impactTypeCtrl: categoryOption.impact_type,
      pertinentCtrl: categoryOption.pertinent,
      relevantCtrl: categoryOption.relevant,
    });

    categoryOption.category_section.forEach((cat: any) => {
      this.addCategoryIndicator(this.section.categories, {
        id: cat.category.id,
        code: cat.category.code,
        name: cat.category.name,
        description: cat.description,
        indicator: cat.indicator?.id,
        indicatorOther: cat.indicator?.name,
        baseValue: cat.base_value,
        expectedValue: cat.expected_value,
        accumulatedValue: cat.accumulated_value,
      });
    });
    categoryOption.other.forEach((other: any) => {
      this.addCategoryIndicator(
        this.section.categories,
        {
          name: other.name,
          description: other.description,
          indicator: other.indicator?.id,
          indicatorOther: other.indicator?.name,
          baseValue: other.base_value,
          expectedValue: other.expected_value,
          accumulatedValue: other.accumulated_value,
        },
        'optionOtherCtrl',
      );
    });
  }

  buildCategoryPayload() {
    const categorySection = this.formArray.at(this.section.categories) as FormGroup;

    const categoriesArray = categorySection.get('categoriesCtrl') as FormArray;
    const optionOtherArray = categorySection.get('optionOtherCtrl') as FormArray;

    return {
      category_section: categoriesArray.controls.map((ctrl: AbstractControl) => {
        const cat = ctrl.value;
        return {
          category: cat.id,
          description: cat.description,
          indicator: cat.indicator || cat.indicatorOther,
          base_value: cat.baseValue,
          expected_value: cat.expectedValue,
          accumulated_value: cat.accumulatedValue,
        };
      }),
      other: optionOtherArray.controls.map((ctrl: AbstractControl) => {
        const cat = ctrl.value;
        return {
          name: cat.name,
          description: cat.description,
          indicator: cat.indicator || cat.indicatorOther,
          base_value: cat.baseValue,
          expected_value: cat.expectedValue,
          accumulated_value: cat.accumulatedValue,
        };
      }),
      impact_type: categorySection.get('impactTypeCtrl')?.value,
      pertinent: categorySection.get('pertinentCtrl')?.value,
      relevant: categorySection.get('relevantCtrl')?.value,
    };
  }

  buildResultPayload() {
    const resultSection = this.formArray.at(this.section.results) as FormGroup;

    const categoriesArray = resultSection.get('categoriesCtrl') as FormArray;
    const impactScaleValues = resultSection.get('impactScaleCtrl')?.value || [];
    const impactScaleTermValues = resultSection.get('impactScaleTermCtrl')?.value || [];

    return [
      {
        scale: categoriesArray.controls.map((ctrl: AbstractControl) => {
          const option = ctrl.value;

          let categoryResult = [];
          if (option.code === this.impactEvalCategories.SCALE) {
            categoryResult = impactScaleValues.map((key: string) => ({
              code: key,
              name: getImpactEvalCategoryKey(key),
            }));
          } else if (option.code === this.impactEvalCategories.SCALE_TERM) {
            categoryResult = impactScaleTermValues.map((key: string) => ({
              code: key,
              name: getImpactEvalCategoryKey(key),
            }));
          }

          return {
            code: option.code,
            name: option.name,
            category_result: categoryResult,
            description: option.description,
            indicator: option.indicator || option.indicatorOther,
            base_value: option.baseValue,
            expected_value: option.expectedValue,
            accumulated_value: option.accumulatedValue,
          };
        }),
      },
    ];
  }

  buildPayload() {
    const payload: SustainableDevelopmentImpactPayload = {
      result: this.buildResultPayload(),
      category_option: this.buildCategoryPayload(),
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
      .pipe(takeUntil(this.destroy$))
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

          this.translateService
            .get('specificLabel.sucessfullySubmittedForm')
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });

          this.stepper?.next();
        },

        error: (error) => {
          this.translateService
            .get('errorLabel.errorProcessing')
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
        },
      });
  }
}
