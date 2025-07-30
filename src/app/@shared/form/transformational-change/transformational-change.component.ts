import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  MOCK_CATEGORIES,
  OTHER,
} from '../constants';

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
  @Input() id: string;
  @Input() adaptation: boolean = false;
  @Input() service: MitigationActionsService | AdaptationActionService;
  form: UntypedFormGroup;
  selectedCategories: string[][] = [];

  other = OTHER;
  impactEvalCategories = IMPACT_EVAL_CATEGORIES;
  impactScale = IMPACT_SCALE;
  impactScaleTerm = IMPACT_SCALE_TERM;
  categoriesScale = CATEGORIES_SCALE;
  processesCategories = MOCK_CATEGORIES;

  processes = 1;
  results = 2;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.createForm();
    this.watchCategorySelection(this.processes);
    this.watchCategorySelection(this.results);
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          visionShortCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionMediumCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          visionLongCtrl: ['', [Validators.required, Validators.minLength(300), Validators.maxLength(1000)]],
          chainResultCtrl: ['', Validators.required],
          barriersCtrl: ['', Validators.required],
          barrierDescriptionCtrl: this.formBuilder.array([]),
          barrierOtherCtrl: [''],
          addressedCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          categoryCtrl: ['', Validators.required],
          categoryOtherCtrl: ['', [Validators.minLength(8), Validators.maxLength(70)]],
          descriptionCtrl: this.formBuilder.array([]),
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

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  submitForm() {}

  descriptionControls(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    const descriptions = sectionGroup.get('descriptionCtrl') as FormArray;
    return descriptions.controls;
  }

  private getSection(section: number) {
    const formArray = this.form.get('formArray') as FormArray;
    const sectionGroup = formArray.at(section) as UntypedFormGroup;
    return sectionGroup;
  }

  onProcessesCategoryChange(event: any) {
    const value = event.value;
    const sectionGroup = this.getSection(this.processes);

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
