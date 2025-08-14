import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { AAType, ODS, TemporalityImpact } from '../interfaces/catalogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUpload } from '@app/@shared/upload-button/file-upload';
import { States } from '@app/@shared/next-state';
import { PermissionService } from '@app/@core/permissions.service';

@Component({
  selector: 'app-adaptation-actions-action-impact',
  templateUrl: './adaptation-actions-action-impact.component.html',
  styleUrls: ['./adaptation-actions-action-impact.component.scss'],
  standalone: false,
})
export class AdaptationActionsActionImpactComponent implements OnInit {
  @Input() stepper: any;
  @Input() type: AAType;
  @Output() onComplete = new EventEmitter<boolean>();

  form: UntypedFormGroup;
  durationInSeconds = 3;
  adaptationAction: AdaptationAction;
  temporalityImpact: TemporalityImpact[] = [];
  generalImpact: TemporalityImpact[] = [];
  ods: ODS[];
  annexSupportingFile: FileUpload;
  @Input() edit: boolean;
  @Input() adaptationActionUpdated: AdaptationAction;
  stateLabel = 'submitted';
  types = AAType;
  state: States;
  @Output() wantsImpactEval = new EventEmitter<boolean>();
  includeImpactInfo: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    public permissions: PermissionService,
    private router: Router,
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
      this.state = this.adaptationAction?.fsm_state?.state as States;
      if (!this.type) this.type = this.adaptationAction?.adaptation_action_information?.adaptation_action_type?.code;
      if (this.adaptationAction && this.adaptationAction.action_impact?.id) {
        this.onComplete.emit(true);
      }
    });
  }

  ngOnInit() {
    this.getGeneralImpact();
    this.getTemporallyInpacts();
    this.createForm();
    this.loadODS();
    if (this.isImpactEvalOnly()) {
      this.changePermissions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && this.form) {
      this.setValidators(this.typeStr !== AAType.A);
    }
  }

  get typeStr(): string {
    return this.type != null ? String(this.type) : '';
  }

  private isImpactEvalOnly(): boolean {
    const cannotEdit = !this.permissions.canEditAA(this.state) || !this.permissions.canEditAcceptedAA(this.state);
    return this.edit && cannotEdit;
  }

  private setValidators(required: boolean) {
    const section = (this.form.get('formArray') as FormArray).at(0) as FormGroup;
    const validators = required ? Validators.required : null;

    section.get('adaptationTemporalityImpactCtrl')?.setValidators(validators);
    section.get('genderEquityElementsCtrl')?.setValidators(validators);
    section.get('actionNegativeImpactCtrl')?.setValidators(validators);
    section.get('objectivesCtrl')?.setValidators(validators);

    section.get('impactsAccordingIndicatorsCtrl')?.setValidators(null);
    section.get('genderEquityElementsQuestionCtrl')?.setValidators(null);
    section.get('AnnexSupportingInformationCtrl')?.setValidators(null);

    section.updateValueAndValidity();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: !this.edit ? this.buildRegisterForm() : this.buildUpdateRegisterForm(),
    });

    const includeImpactControl = this.form.get(['formArray', 1, 'includeImpactInfoCtrl']);
    if (includeImpactControl) {
      includeImpactControl.valueChanges.subscribe((value) => {
        this.wantsImpactEval.emit(value);
      });
    }
  }

  private changePermissions(): void {
    const formArray = this.form.get('formArray') as FormArray;

    formArray.controls.forEach((group: UntypedFormGroup) => {
      Object.keys(group.controls).forEach((key) => {
        const control = group.get(key);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
    });
  }

  loadODS() {
    this.service.loadODS().subscribe(
      (ods) => {
        this.ods = ods;
      },
      (error) => {
        this.ods = [];
      },
    );
  }

  getTemporallyInpacts() {
    this.service.loadTemporalityImpact().subscribe(
      (response) => {
        this.temporalityImpact = response;
      },
      (error) => {
        this.temporalityImpact = [];
      },
    );
  }

  getGeneralImpact() {
    this.service.loadGeneralImpact().subscribe(
      (response) => {
        this.generalImpact = response;
      },
      (error) => {
        this.generalImpact = [];
      },
    );
  }

  buildUpdateRegisterForm() {
    // this.annexSupportingFile = 'file'; // TODO: remove this line when the file upload is implemented
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationTemporalityImpactCtrl: [
          this.adaptationActionUpdated.action_impact.temporality_impact.length > 0
            ? parseInt(this.adaptationActionUpdated.action_impact.temporality_impact[0].id)
            : '',
          Validators.required,
        ],
        impactsAccordingIndicatorsCtrl: [this.adaptationActionUpdated.action_impact.unwanted_action],
        genderEquityElementsCtrl: [
          parseInt(this.adaptationActionUpdated.action_impact.gender_equality),
          Validators.required,
        ],
        genderEquityElementsQuestionCtrl: [this.adaptationActionUpdated.action_impact.gender_equality_description],
        actionNegativeImpactCtrl: [
          this.adaptationActionUpdated.action_impact.unwanted_action_description,
          Validators.required,
        ],
        AnnexSupportingInformationCtrl: [''],
        objectivesCtrl: [
          this.adaptationActionUpdated.action_impact.ods.map((x) => parseInt(x.id)),
          Validators.required,
        ],
      }),
      this.formBuilder.group({
        includeImpactInfoCtrl: [
          false, // TODO: adjust when BE available
          Validators.required,
        ],
      }),
    ]);
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationTemporalityImpactCtrl: ['', Validators.required],
        impactsAccordingIndicatorsCtrl: [''],
        genderEquityElementsCtrl: ['', Validators.required],
        genderEquityElementsQuestionCtrl: [''],
        actionNegativeImpactCtrl: ['', Validators.required],
        AnnexSupportingInformationCtrl: [''],
        objectivesCtrl: ['', Validators.required], // new field
      }),
      this.formBuilder.group({
        includeImpactInfoCtrl: [false, Validators.required],
      }),
    ]);
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  submitForm() {
    if (this.permissions.canEditAA(this.state)) {
      this.handleEditableAASubmission();
      return;
    }

    if (this.permissions.canEditAcceptedAA(this.state) || this.isImpactEvalOnly()) {
      if (this.includeImpactInfo) {
        this.stepper.next();
      } else {
        this.router.navigate(['/adaptation/actions'], { replaceUrl: true });
      }
    }
  }

  private handleEditableAASubmission(): void {
    const isTypeA = this.type.toString() === this.types.A;
    console.log(isTypeA, this.isEmpty());
    if (isTypeA && this.isEmpty()) {
      this.handleSubmissionSuccess();
      return;
    }

    const payload = this.buildPayload();

    this.service.updateCurrentAdaptationAction({
      ...this.adaptationAction,
      ...payload,
    });

    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe({
      next: () => this.handleSubmissionSuccess(),
      error: () => this.openSnackBar('Error al crear el formulario, inténtelo de nuevo más tarde'),
    });
  }

  private handleSubmissionSuccess() {
    this.openSnackBar('Formulario creado correctamente');
    this.onComplete.emit(true);

    if (this.includeImpactInfo) {
      this.stepper.next();
    } else {
      this.router.navigate(['/adaptation/actions'], { replaceUrl: true });
    }
  }

  isDisabled(): boolean {
    if (!this.isImpactEvalOnly()) {
      const formArray = this.form.get('formArray') as FormArray;
      const group = formArray?.at(0) as FormGroup;

      const hasAnnex = !!this.annexSupportingFile;
      const isTypeA = this.type === this.types.A;

      const groupIsComplete = group && group.valid && !this.isEmpty() && hasAnnex;
      const groupCondition = isTypeA ? this.isEmpty() || groupIsComplete : groupIsComplete;
      const validIncludeImpactInfo = this.includeImpactInfo !== null;
      const allValid = groupCondition && validIncludeImpactInfo;
      return !allValid;
    } else {
      return false;
    }
  }

  isEmpty(): boolean {
    const section = this.form.get('formArray').get([0]) as FormGroup;
    const empty = Object.values(section.controls).every((control) => {
      const value = control.value;

      return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'number' && isNaN(value)) ||
        (Array.isArray(value) && value.length === 0)
      );
    });
    return empty;
  }

  buildPayload() {
    const context = {
      action_impact: {
        gender_equality: this.form.value.formArray[0].genderEquityElementsCtrl,
        gender_equality_description: this.form.value.formArray[0].genderEquityElementsQuestionCtrl
          ? this.form.value.formArray[0].genderEquityElementsQuestionCtrl
          : null,
        unwanted_action: this.form.value.formArray[0].impactsAccordingIndicatorsCtrl,
        unwanted_action_description: this.form.value.formArray[0].actionNegativeImpactCtrl,
        temporality_impact: [this.form.value.formArray[0].adaptationTemporalityImpactCtrl],
        general_impact: this.form.value.formArray[0].adaptationTemporalityImpactCtrl,
        ods: this.form.value.formArray[0].objectivesCtrl, //this.form.value.formArray[0].AnnexSupportingInformationCtrl
      },
    };

    if (this.adaptationActionUpdated.next_state[0].state === this.stateLabel) {
      context['is_complete'] = true;
    }

    return context;
  }

  uploadFile(event: FileUpload) {
    this.annexSupportingFile = event;
  }
}
