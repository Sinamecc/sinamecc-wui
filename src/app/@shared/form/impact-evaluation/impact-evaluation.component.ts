import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IMPACT_DIMENSION, IMPACT_EVALUATION, IMPACT_TYPE, MOCK_CATEGORIES, MOCK_CATEGORY_GROUP } from '../constants';
import { Category, SustainableDevelopmentImpactPayload } from '../interface';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { finalize, Observable } from 'rxjs';
import { States } from '@app/@shared/next-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactFormBaseComponent } from '../impact-form-base.component';

@Component({
  selector: 'app-impact-evaluation',
  templateUrl: './impact-evaluation.component.html',
  styleUrl: './impact-evaluation.component.scss',
  standalone: false,
})
export class ImpactEvaluationComponent extends ImpactFormBaseComponent {
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() state = new EventEmitter<States>();
  @Input() stepper: any;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  item: AdaptationAction | MitigationAction;
  form: UntypedFormGroup;
  loading = false;

  impactType = IMPACT_TYPE;
  impactDimension = IMPACT_DIMENSION;
  impactEvaluation = IMPACT_EVALUATION;

  categories = MOCK_CATEGORIES; // TODO: delete
  categoryGroups = MOCK_CATEGORY_GROUP; // TODO: delete

  constructor(
    private formBuilder: UntypedFormBuilder,
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
    this.watchOptionSelection(this.impactEvaluation.categories);
    this.watchOptionSelection(this.impactEvaluation.results);
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

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          dimensionCtrl: ['', Validators.required],
          categoryGroupCtrl: ['', Validators.required],
          optionCtrl: ['', Validators.required], // category
          optionOtherCtrl: this.formBuilder.array([]), // category other
          categoriesCtrl: this.formBuilder.array([]),
          impactTypeCtrl: ['', Validators.required],
          pertinentCtrl: ['', Validators.required],
          relevantCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          optionCtrl: ['', Validators.required], // category
          impactScaleCtrl: ['', Validators.required],
          impactScaleTermCtrl: ['', Validators.required],
          categoriesCtrl: this.formBuilder.array([]),
        }),
      ]),
    });
  }

  private updateForm() {}

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
}
