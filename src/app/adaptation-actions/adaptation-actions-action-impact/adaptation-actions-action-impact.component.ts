import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { ODS, TemporalityImpact } from '../interfaces/catalogs';

@Component({
  selector: 'app-adaptation-actions-action-impact',
  templateUrl: './adaptation-actions-action-impact.component.html',
  styleUrls: ['./adaptation-actions-action-impact.component.scss'],
})
export class AdaptationActionsActionImpactComponent implements OnInit {
  form: FormGroup;
  durationInSeconds = 3;
  adaptationAction: AdaptationAction;
  temporalityImpact: TemporalityImpact[] = [];
  generalImpact: TemporalityImpact[] = [];
  ods: ODS[];

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private router: Router
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
    });
  }

  ngOnInit() {
    this.getGeneralImpact();
    this.getTemporallyInpacts();
    this.createForm();
    this.loadODS();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.buildRegisterForm(),
    });
  }

  loadODS() {
    this.service.loadODS().subscribe(
      (ods) => {
        this.ods = ods;
      },
      (error) => {
        this.ods = [];
      }
    );
  }

  getTemporallyInpacts() {
    this.service.loadTemporalityImpact().subscribe(
      (response) => {
        this.temporalityImpact = response;
      },
      (error) => {
        this.temporalityImpact = [];
      }
    );
  }

  getGeneralImpact() {
    this.service.loadGeneralImpact().subscribe(
      (response) => {
        this.generalImpact = response;
      },
      (error) => {
        this.generalImpact = [];
      }
    );
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationTemporalityImpactCtrl: ['', Validators.required],
        impactsAccordingIndicatorsCtrl: [''],
        genderEquityElementsCtrl: ['', Validators.required],
        genderEquityElementsQuestionCtrl: [''],
        actionNegativeImpactCtrl: ['', Validators.required],
        AnnexSupportingInformationCtrl: ['', Validators.required],
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
    const payload: AdaptationAction = this.buildPayload();

    this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));

    this.service.createNewAdaptationAction(Object.assign(this.adaptationAction, payload)).subscribe(
      (_) => {
        this.openSnackBar('Formulario creado correctamente', '');
        this.router.navigate([`/adaptation/actions`], {
          replaceUrl: true,
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      }
    );
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

    return context;
  }
}
