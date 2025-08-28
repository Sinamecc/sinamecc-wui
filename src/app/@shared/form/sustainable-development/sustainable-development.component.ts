import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { getCategoriesScale, IMPACT_EVALUATION, IMPACT_TYPE } from '../constants';
import { Category, CategoryGroup, Dimension, SustainableDevelopmentImpactPayload } from '../interface';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { finalize, Observable } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactEvaluationComponent } from '../impact-evaluation.component';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { getImpactEvalCategoryKey } from '../utils';

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
      (this.service as MitigationActionsService).currentMitigationAction.subscribe((message) => {
        this.item = message;
      });
    } else {
      (this.service as AdaptationActionService).currentAdaptationActionSource.subscribe((message) => {
        this.item = message;
      });
    }

    this.createForm();
    if (this.item.category_option?.id) {
      this.updateForm();
    }

    this.watchOptionSelection(this.impactEvaluation.categories);
    this.watchOptionSelection(this.impactEvaluation.results);
    this.categoriesScale = getCategoriesScale(this.adaptation);
    this.loadDimensions();
  }

  loadDimensions() {
    this.impactService.getDimensions().subscribe((dimensions: Dimension[]) => {
      this.dimensions = dimensions;
    });
  }

  onDimensionChange(event: any) {
    if (!event || event.length === 0) {
      this.categoryGroups = [];
      this.categories = [];
      this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('categoryGroupCtrl')?.setValue([]);
      this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('optionCtrl')?.setValue([]);
      return;
    }

    this.impactService
      .getCategoryGroupsByDimensions({
        dimension_list: event.map((code: string) => ({ code_dimension: code })),
      })
      .subscribe((groups: CategoryGroup[]) => {
        const grouped = this.groupOptions(groups);
        this.categoryGroups = Object.entries(grouped).map(([dimension, items]) => ({
          dimension,
          items: items as CategoryGroup[],
        }));
        this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('categoryGroupCtrl')?.setValue([]);
        this.categories = [];
        this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('optionCtrl')?.setValue([]);
      });
  }

  onCategoryGroupChange(event: CategoryGroup[]) {
    if (!event || event.length === 0) {
      this.categories = [];
      this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('optionCtrl')?.setValue([]);
      return;
    }

    this.impactService
      .getCategoriesByCategoryGroups({
        category_group_list: event.map((category: CategoryGroup) => ({
          code_category_group: category.code,
          code_dimension: category.dimension.code,
        })),
      })
      .subscribe((categories: Category[]) => {
        const grouped = this.groupOptions(categories);
        this.categories = Object.entries(grouped).map(([category, items]) => ({
          category,
          items: items as Category[],
        }));
        this.form?.get('formArray')?.get([this.impactEvaluation.categories])?.get('optionCtrl')?.setValue([]);
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

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          dimensionCtrl: ['', Validators.required],
          categoryGroupCtrl: [[], Validators.required],
          optionCtrl: [[], Validators.required], // category
          optionOtherCtrl: this.formBuilder.array([]), // category other
          categoriesCtrl: this.formBuilder.array([]),
          impactTypeCtrl: ['', Validators.required],
          pertinentCtrl: ['', Validators.required],
          relevantCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          optionCtrl: [[], Validators.required], // category
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
        }),
      ]),
    });
  }

  private updateForm() {
    const category = this.item.category_option[0];
    const result = this.item.result;

    console.log('CATEGORY OPTION', category);
    console.log('Result ', result);

    return;
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          dimensionCtrl: [, Validators.required],
          categoryGroupCtrl: [[], Validators.required],
          optionCtrl: [[], Validators.required], // category
          optionOtherCtrl: this.formBuilder.array([]), // category other
          categoriesCtrl: this.formBuilder.array([]),
          impactTypeCtrl: [category.impact_type, Validators.required],
          pertinentCtrl: [category.pertinent, Validators.required],
          relevantCtrl: [category.relevant, Validators.required],
        }),
        this.formBuilder.group({
          optionCtrl: [[], Validators.required], // category
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
        }),
      ]),
    });
  }

  buildCategoryPayload() {
    const categorySection = this.form.value.formArray[this.impactEvaluation.categories];
    return {
      category_section: categorySection.categoriesCtrl.map((cat) => ({
        category: cat.id,
        description: cat.description,
        indicator: cat.indicator || cat.indicatorOther,
        base_value: cat.baseValue,
        expected_value: cat.expectedValue,
        accumulated_value: cat.accumulatedValue,
      })),
      other: categorySection.optionOtherCtrl.map((cat) => ({
        name: cat.name,
        description: cat.description,
        indicator: cat.indicator || cat.indicatorOther,
        base_value: cat.baseValue,
        expected_value: cat.expectedValue,
        accumulated_value: cat.accumulatedValue,
      })),
      impact_type: categorySection.impactTypeCtrl,
      pertinent: categorySection.pertinentCtrl,
      relevant: categorySection.relevantCtrl,
    };
  }

  buildResultPayload() {
    const resultSection = this.form.value.formArray[this.impactEvaluation.results];
    return [
      {
        scale: resultSection.categoriesCtrl.map((option) => {
          let categoryResult = [];
          if (option.code === this.impactEvalCategories.SCALE) {
            categoryResult = resultSection.impactScaleCtrl.map((key) => ({
              code: key,
              name: getImpactEvalCategoryKey(key),
            }));
          } else if (option.code === this.impactEvalCategories.SCALE_TERM) {
            categoryResult = resultSection.impactScaleTermCtrl.map((key) => ({
              code: key,
              name: getImpactEvalCategoryKey(key),
            }));
          }

          return {
            code: option.code,
            name: option.name,
            category_result: categoryResult,
            description: option.description,
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
}
