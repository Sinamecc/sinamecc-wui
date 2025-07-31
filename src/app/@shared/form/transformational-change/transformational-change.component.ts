import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { States } from '@app/@shared/next-state';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import {
  CATEGORIES_SCALE,
  IMPACT_EVAL_CATEGORIES,
  IMPACT_SCALE,
  IMPACT_SCALE_TERM,
  MOCK_BARRIERS,
  MOCK_CATEGORIES,
  OTHER,
  TRANSFORMATION_CHANGE,
} from '../constants';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

@Component({
  selector: 'app-transformational-change',
  templateUrl: './transformational-change.component.html',
  styleUrl: './transformational-change.component.scss',
  standalone: false,
})
export class TransformationalChangeComponent {
  @Output() onComplete = new EventEmitter<boolean>();
  @Output() state = new EventEmitter<States>();
  @Input() stepper: any;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  item: AdaptationAction | MitigationAction;
  form: UntypedFormGroup;

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  categoriesScale = CATEGORIES_SCALE;
  processesCategories = MOCK_CATEGORIES;
  transformationalChange = TRANSFORMATION_CHANGE;
  barriers = MOCK_BARRIERS;

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
    this.watchOptionSelection(this.transformationalChange.processes);
    this.watchOptionSelection(this.transformationalChange.results);
    this.watchOptionSelection(this.transformationalChange.identification);
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          visionShortCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionMidCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionLongCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          chainResultCtrl: ['', Validators.required],
          optionCtrl: ['', Validators.required], // barriers
          optionOtherCtrl: [''], // barriers other
          categoriesCtrl: this.formBuilder.array([]), // barrier description
          addressedCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          optionCtrl: ['', Validators.required],
          optionOtherCtrl: ['', [Validators.minLength(8), Validators.maxLength(70)]],
          categoriesCtrl: this.formBuilder.array([]),
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

  get formArray(): FormArray {
    return this.form.get('formArray') as FormArray;
  }

  submitForm() {}

  categoriesControls(section: number) {
    const sectionGroup = this.formArray.at(section) as UntypedFormGroup;
    const categories = sectionGroup.get('categoriesCtrl') as FormArray;
    return categories.controls;
  }

  private getSection(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    return sectionGroup;
  }

  onOtherOptionChange(event: any, section: number) {
    const value = event.value;
    const sectionGroup = this.getSection(section);

    if (value === this.other) {
      sectionGroup?.get('optionOtherCtrl')?.setValidators([Validators.minLength(1), Validators.maxLength(100)]);
    } else {
      sectionGroup?.get('optionOtherCtrl')?.setValidators([]);
    }
    sectionGroup?.get('optionOtherCtrl')?.updateValueAndValidity();
  }

  onScaleChange(event: any) {
    const value = event.value;
    const sectionGroup = this.getSection(this.transformationalChange.results);

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

  private watchOptionSelection(section: number) {
    const sectionGroup = this.getSection(section);
    const categoryCtrl = sectionGroup.get('optionCtrl');
    const categoriesArray = sectionGroup.get('categoriesCtrl') as FormArray;
    categoryCtrl?.valueChanges.subscribe((values: any[]) => {
      while (categoriesArray.length > 0) {
        categoriesArray.removeAt(0);
      }

      values?.forEach((value) => {
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
