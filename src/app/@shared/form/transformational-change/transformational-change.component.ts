import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { States } from '@app/@shared/next-state';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import {
  CHARACTERISTICS_MOCK,
  getCategoriesScale,
  MOCK_BARRIERS,
  TRANSFORMATION_CHANGE,
  TRANSFORMATIONAL_CATEGORIES,
} from '../constants';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { ImpactEvaluationComponent } from '../impact-evaluation.component';

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

  transformationalChange = TRANSFORMATION_CHANGE;
  transCategories = TRANSFORMATIONAL_CATEGORIES;

  // TODO: delete mocks
  barriers = MOCK_BARRIERS;
  characteristics = CHARACTERISTICS_MOCK;

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
    this.watchOptionSelection(this.transformationalChange.processes);
    this.watchOptionSelection(this.transformationalChange.results);
    this.watchOptionSelection(this.transformationalChange.identification);
    this.categoriesScale = getCategoriesScale(this.adaptation);
  }

  get characteristicsToView(): any[] {
    const selectedCategory: number[] =
      this.form?.value?.formArray?.[this.transformationalChange.processes]?.categoryCtrl;
    if (!selectedCategory || selectedCategory.length === 0) return [];
    return this.characteristics.filter((group) => selectedCategory.includes(group.category));
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

  private updateForm() {}

  submitForm() {}
}
