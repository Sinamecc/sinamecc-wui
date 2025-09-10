import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { States } from '@app/@shared/next-state';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import {
  getCategoriesScale,
  MOCK_BARRIERS,
  OTHER,
  TRANSFORMATION_CHANGE,
  TRANSFORMATIONAL_CATEGORIES,
} from '../constants';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactEvaluationComponent } from '../impact-evaluation.component';
import { ImpactEvaluationService } from '../impact-evaluation.service';
import { getImpactEvalCategoryKey } from '../utils';
import { finalize, Observable, takeUntil } from 'rxjs';
import { TransformationalChangePayload } from '../types/payload';
import {
  BarrierOptionResult,
  CategoryCT,
  Characteristic,
  ImpactIdentificationResult,
  ImpactProcessResult,
  SpecificImpactResult,
} from '../types/results';
import { requireOtherIfSelected } from '../validators/other';
import { requireCategoriesIfOptionsSelected } from '../validators/categories';

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
  categoriesCT: CategoryCT[];
  characteristics: {
    ct: string;
    items: Characteristic[];
  }[] = [];

  loading = false;
  IS_BARRIER = true;
  IS_CT = true;

  section = TRANSFORMATION_CHANGE;
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
    if ((this.item.process as ImpactProcessResult).id) {
      this.updateForm();
    }
    this.applyConditionalValidators();
    this.watchOptionSelection(this.section.processes, !this.IS_BARRIER, this.IS_CT);
    this.watchOptionSelection(this.section.results);
    this.watchOptionSelection(this.section.identification, this.IS_BARRIER);
    this.categoriesScale = getCategoriesScale(this.adaptation);
    this.loadCategoriesCT();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCategoriesCT() {
    this.impactService
      .getCategoryCT()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories: CategoryCT[]) => {
        this.categoriesCT = categories;
      });
  }

  onCategoryCTChange(event: any) {
    if (!event || event.length === 0) {
      this.characteristics = [];
      this.formArray?.get([this.section.processes])?.get('categoryGroupCtrl')?.setValue([]);
      return;
    }
    this.impactService
      .getCharacteristics({
        category_ct_list: event.map((cat) => ({
          code_category_ct: cat.code,
        })),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((characteristics: Characteristic[]) => {
        const grouped = this.groupOptions(characteristics);
        this.characteristics = Object.entries(grouped).map(([ct, items]) => ({
          ct: ct,
          items: items,
        }));
      });
  }

  groupOptions(options: Characteristic[]): { [key: string]: Characteristic[] } {
    const grouped: { [key: string]: Characteristic[] } = {};

    options.forEach((item) => {
      const groupName = item.category_ct?.name || 'general.other';

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
        // identification
        this.formBuilder.group({
          visionShortCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionMidCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionLongCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          optionCtrl: [[], Validators.required], // barriers
          optionOtherCtrl: this.formBuilder.array([]),
          categoriesCtrl: this.formBuilder.array([]),
          addressedCtrl: ['', Validators.required],
        }),
        // process
        this.formBuilder.group({
          categoryCtrl: ['', Validators.required],
          optionCtrl: [[], Validators.required], // characteristic
          optionOtherCtrl: [''],
          categoriesCtrl: this.formBuilder.array([]),
        }),
        // results
        this.formBuilder.group({
          optionCtrl: [[], Validators.required], // category
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
        }),
      ]),
    });
  }

  private applyConditionalValidators(): void {
    const identificationGroup = this.formArray.at(this.section.identification);
    const processGroup = this.formArray.at(this.section.processes);
    const resultsGroup = this.formArray.at(this.section.results);

    // identification
    const optionOtherCtrl = identificationGroup.get('optionOtherCtrl') as FormArray;
    optionOtherCtrl.setValidators([requireOtherIfSelected(() => this.isOtherSelected(this.section.identification))]);
    optionOtherCtrl.updateValueAndValidity();

    const identificationCategoriesCtrl = identificationGroup.get('categoriesCtrl') as FormArray;
    identificationCategoriesCtrl.setValidators([
      requireCategoriesIfOptionsSelected(() => this.getSelectedOptions(this.section.identification)),
    ]);
    identificationCategoriesCtrl.updateValueAndValidity();

    // process
    const otherCtrl = processGroup.get('optionOtherCtrl') as FormArray;
    otherCtrl.setValidators([requireOtherIfSelected(() => this.isOtherSelected(this.section.identification))]);
    otherCtrl.updateValueAndValidity();

    const processCategoriesCtrl = processGroup.get('categoriesCtrl') as FormArray;
    processCategoriesCtrl.setValidators([
      requireCategoriesIfOptionsSelected(() => this.getSelectedOptions(this.section.processes)),
    ]);
    processCategoriesCtrl.updateValueAndValidity();

    // results
    const resultsCategoriesCtrl = resultsGroup.get('categoriesCtrl') as FormArray;
    resultsCategoriesCtrl.setValidators([
      requireCategoriesIfOptionsSelected(() => this.getSelectedOptions(this.section.identification)),
    ]);
    resultsCategoriesCtrl.updateValueAndValidity();
  }

  buildFinalResultPayload() {
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

  buildProcessPayload() {
    const process = this.formArray.at(this.section.processes) as FormGroup;

    const optionCtrlValue = process.get('optionCtrl')?.value || [];
    const optionOtherValue = process.get('optionOtherCtrl')?.value || '';
    const categoriesArray = process.get('categoriesCtrl') as FormArray;
    return {
      characteristic: optionCtrlValue.filter((cat: any) => cat !== this.other).map((char: any) => char.id),
      other: optionOtherValue,
      specific_impact: categoriesArray.controls.map((ctrl: AbstractControl) => {
        const cat = ctrl.value;
        return {
          category_ct: cat.ct,
          description: cat.description,
          indicator: cat.indicator || cat.indicatorOther,
          base_value: cat.baseValue,
          expected_value: cat.expectedValue,
          accumulated_value: cat.accumulatedValue,
        };
      }),
    };
  }

  buildIdenfiticationPayload() {
    const identification = this.formArray.at(this.section.identification) as FormGroup;
    const categoriesArray = identification.get('categoriesCtrl') as FormArray;
    const optionOtherArray = identification.get('optionOtherCtrl') as FormArray;

    return {
      vision: null,
      short_term: identification.get('visionShortCtrl')?.value,
      medium_term: identification.get('visionMidCtrl')?.value,
      long_term: identification.get('visionLongCtrl')?.value,
      barrier_option: categoriesArray.controls.map((ctrl: AbstractControl) => {
        const barrier = ctrl.value;
        return {
          code: barrier.code,
          name: barrier.name,
          description: barrier.description,
        };
      }),
      other_barrier_option: optionOtherArray.controls.map((ctrl: AbstractControl) => {
        const barrier = ctrl.value;
        return {
          description: barrier.description,
        };
      }),
      is_directly_addressed: identification.get('addressedCtrl')?.value,
    };
  }

  buildPayload() {
    const payload: TransformationalChangePayload = {
      final_result: this.buildFinalResultPayload(),
      process: this.buildProcessPayload(),
      impact_identification: this.buildIdenfiticationPayload(),
    };
    return payload;
  }

  private updateForm() {
    if (this.item.impact_identification) {
      this.patchIdentification(this.item.impact_identification as ImpactIdentificationResult);
    }

    if (this.item.process) {
      this.patchProcess(this.item.process as ImpactProcessResult);
    }

    if (this.item.final_result) {
      this.patchResults(this.item.final_result, this.adaptation, this.section.results);
    }
  }

  private patchProcess(process: ImpactProcessResult): void {
    const sectionGroup = this.getSection(this.section.processes);
    const specificImpact = process.specific_impact;
    const characteristic = process.characteristic;
    const categoryCT = characteristic.map((char) => char.category_ct);
    const hasOthers = process.other && process.other.trim() != '';

    this.impactService
      .getCharacteristics({
        category_ct_list: categoryCT.map((ct) => ({ code_category_ct: ct.code })),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((fetched: Characteristic[]) => {
        const grouped = this.groupOptions(fetched);

        this.characteristics = Object.entries(grouped).map(([ct, items]) => ({
          ct,
          items,
        }));

        const selectedOptions: (string | Characteristic)[] = [...characteristic];
        if (hasOthers) {
          selectedOptions.push('other');
          sectionGroup.get('optionOtherCtrl')?.patchValue(process.other);
        }

        sectionGroup.get('optionCtrl')?.patchValue(selectedOptions);
      });

    sectionGroup.patchValue({
      categoryCtrl: categoryCT,
    });

    specificImpact.forEach((char: SpecificImpactResult) => {
      this.addCategoryIndicator(this.section.processes, {
        id: char.id,
        ct: char.category_ct.id,
        code: char.category_ct.code,
        name: char.category_ct.name,
        description: char.description,
        indicator: char.indicator?.id,
        indicatorOther: char.indicator?.name,
        baseValue: char.base_value,
        expectedValue: char.expected_value,
        accumulatedValue: char.accumulated_value,
      });
    });
  }

  private patchIdentification(identification: ImpactIdentificationResult) {
    const sectionGroup = this.getSection(this.section.identification);
    const hasOthers = identification.other_barrier_option.length;

    let barriers = [];
    identification.barrier_option.forEach((barrier: BarrierOptionResult) => {
      barriers.push(barrier);
      this.addCategoryIndicator(this.section.identification, {
        id: barrier.id,
        code: barrier.code,
        name: barrier.name,
        description: barrier.description,
        barrier: true,
      });
    });
    if (hasOthers) barriers.push(OTHER);
    identification.other_barrier_option.forEach((other: any) => {
      this.addCategoryIndicator(
        this.section.identification,
        {
          description: other.description,
          barrier: true,
        },
        'optionOtherCtrl',
      );
    });

    sectionGroup.patchValue({
      visionShortCtrl: identification.short_term,
      visionMidCtrl: identification.medium_term,
      visionLongCtrl: identification.long_term,
      optionCtrl: barriers,
      addressedCtrl: identification.is_directly_addressed,
    });
  }

  compareBarrier = (o1: any, o2: any): boolean => {
    return o1 && o2 ? o1.name === o2.name : o1 === o2;
  };

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
            .get('form.success')
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
