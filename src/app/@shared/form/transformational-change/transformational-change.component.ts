import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { States } from '@app/@shared/next-state';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { getCategoriesScale, MOCK_BARRIERS, TRANSFORMATION_CHANGE, TRANSFORMATIONAL_CATEGORIES } from '../constants';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactEvaluationComponent } from '../impact-evaluation.component';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { CategoryCT, Characteristic, TransformationalChangePayload } from '../interface';
import { getImpactEvalCategoryKey } from '../utils';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-transformational-change',
  templateUrl: './transformational-change.component.html',
  styleUrl: './transformational-change.component.scss',
  standalone: false,
})
export class TransformationalChangeComponent extends ImpactEvaluationComponent {
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() state = new EventEmitter<States>();
  @Input() stepper: any;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  item: AdaptationAction | MitigationAction;
  form: UntypedFormGroup;
  characteristics: Characteristic[];
  categoriesCT: CategoryCT[];
  loading = false;

  transformationalChange = TRANSFORMATION_CHANGE;
  transCategories = TRANSFORMATIONAL_CATEGORIES;

  barriers = MOCK_BARRIERS;

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
    this.watchOptionSelection(this.transformationalChange.processes);
    this.watchOptionSelection(this.transformationalChange.results);
    this.watchOptionSelection(this.transformationalChange.identification);
    this.categoriesScale = getCategoriesScale(this.adaptation);
    this.loadCategoriesCT();
    this.loadCharacteristics();
  }

  get characteristicsToView(): Characteristic[] {
    const selectedCategory: CategoryCT[] =
      this.form?.value?.formArray?.[this.transformationalChange.processes]?.categoryCtrl;

    if (!selectedCategory || selectedCategory.length === 0) return [];

    const selectedIds = selectedCategory.map((c) => c.id);
    return this.characteristics.filter((ch) => selectedIds.includes(ch.category_ct.id));
  }

  private loadCategoriesCT() {
    this.impactService.getCategoryCT().subscribe((categories: CategoryCT[]) => {
      this.categoriesCT = categories;
    });
  }

  private loadCharacteristics() {
    this.impactService.getCharacteristics().subscribe((characteristics: Characteristic[]) => {
      this.characteristics = characteristics;
    });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          visionShortCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionMidCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionLongCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          chainResultCtrl: ['', Validators.required],
          optionCtrl: [[], Validators.required], // barriers
          optionOtherCtrl: this.formBuilder.array([]), // barriers other
          categoriesCtrl: this.formBuilder.array([]), // barrier description
          addressedCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          categoryCtrl: ['', Validators.required],
          optionCtrl: [[], Validators.required], // characteristic
          optionOtherCtrl: this.formBuilder.array([]),
          categoriesCtrl: this.formBuilder.array([]),
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

  buildFinalResultPayload() {
    const resultSection = this.form.value.formArray[this.transformationalChange.results];
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
            indicator: option.indicator || option.indicatorOther,
            base_value: option.baseValue,
            expected_value: option.expectedValue,
            accumulated_value: option.accumulatedValue,
          };
        }),
      },
    ];
  }

  buildProcessPayload() {
    const process = this.form.value.formArray[this.transformationalChange.processes];
    return {
      characteristics: process.optionCtrl.map((char) => char.id),
      other: null,
      specific_impact: null,
    };
  }

  buildIdenfiticationPayload() {
    const process = this.form.value.formArray[this.transformationalChange.identification];
  }

  buildPayload() {
    const payload: TransformationalChangePayload = {
      final_result: this.buildFinalResultPayload(),
      process: this.buildProcessPayload(),
    };
    return payload;
  }

  private updateForm() {}

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
