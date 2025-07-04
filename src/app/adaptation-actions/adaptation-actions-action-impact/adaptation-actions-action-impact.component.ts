import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { AAType, ODS, TemporalityImpact } from '../interfaces/catalogs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUpload } from '@app/@shared/upload-button/file-upload';

@Component({
  selector: 'app-adaptation-actions-action-impact',
  templateUrl: './adaptation-actions-action-impact.component.html',
  styleUrls: ['./adaptation-actions-action-impact.component.scss'],
  standalone: false,
})
export class AdaptationActionsActionImpactComponent implements OnInit {
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

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private router: Router,
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] && this.form) {
      const type = changes['type'].currentValue;

      if (type === AAType.A) {
        this.removeValidators();
      } else {
        this.resetValidators();
      }
      this.updateValidity();
    }
  }

  private removeValidators() {
    const section = this.form.get('formArray').get([0]);
    section.get('adaptationTemporalityImpactCtrl').setValidators(null);
    section.get('genderEquityElementsCtrl').setValidators(null);
    section.get('actionNegativeImpactCtrl').setValidators(null);
    section.get('objectivesCtrl').setValidators(null);
    section.get('impactsAccordingIndicatorsCtrl').setValidators(null);
    section.get('genderEquityElementsQuestionCtrl').setValidators(null);
    section.get('AnnexSupportingInformationCtrl').setValidators(null);
  }

  private resetValidators() {
    const section = this.form.get('formArray').get([0]);
    section.get('adaptationTemporalityImpactCtrl').setValidators(Validators.required);
    section.get('genderEquityElementsCtrl').setValidators(Validators.required);
    section.get('actionNegativeImpactCtrl').setValidators(Validators.required);
    section.get('objectivesCtrl').setValidators(Validators.required);
    section.get('impactsAccordingIndicatorsCtrl').setValidators(null);
    section.get('genderEquityElementsQuestionCtrl').setValidators(null);
    section.get('AnnexSupportingInformationCtrl').setValidators(null);
  }

  private updateValidity() {
    const section = this.form.get('formArray').get([0]);
    Object.keys((section as FormGroup).controls).forEach((controlName) => {
      section.get(controlName).updateValueAndValidity();
    });
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: !this.edit ? this.buildRegisterForm() : this.buildUpdateRegisterForm(),
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
        ], // new field
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
    ]);
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  submitForm() {
    if (!(this.type === this.types.A && this.isEmpty())) {
      const payload: any = this.buildPayload();
      this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
      this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
        (_) => {
          this.openSnackBar('Formulario creado correctamente', '');
          this.onComplete.emit(true);
          this.router.navigate([`/adaptation/actions`], {
            replaceUrl: true,
          });
        },
        (error) => {
          this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
        },
      );
    } else {
      this.router.navigate([`/adaptation/actions`], {
        replaceUrl: true,
      });
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
