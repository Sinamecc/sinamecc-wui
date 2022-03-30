import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-adaptation-actions-indicators',
  templateUrl: './adaptation-actions-indicators.component.html',
  styleUrls: ['./adaptation-actions-indicators.component.scss'],
})
export class AdaptationActionsIndicatorsComponent implements OnInit {
  form: FormGroup;
  @Input() mainStepper: any;
  durationInSeconds = 3;
  adaptationAction: AdaptationAction;
  typeIndicatorToolTipTxt =
    'Los indicadores pueden ser del tipo Gestión: permiten medir la cantidad de bienes y servicios generados, así como el grado de avance de acciones climáticas a nivel de insumos, actividades y productos, centrándose en aspectos relevantes y evitar medir aspectos rutinarios y operativos o Resultados: se refiere a la medición de efectos e impactos logrados por alguna intervención, o bien, por causa de la crisis climática';
  indicatorToolTipTxt =
    'Un indicador es una expresión cualitativa o cuantitativa, que es observable y permite describir las características de la realidad, a través de la evolución de una variable';

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private service: AdaptationActionService
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
    });
  }

  ngOnInit() {
    this.createForm();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.buildRegisterForm(),
    });
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionIndicatorNameCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionIndicatorDescriptionCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        adaptationActionIndicatorUnitCtrl: ['', [Validators.required, Validators.maxLength(100)]],
        adaptationActionIndicatorMetodologyCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        adaptationActionIndicatorUnitFileCtrl: [''], // new field
        adaptationActionIndicatorFrecuenceCtrl: ['', [Validators.required]],
        adaptationActionIndicatorFrecuenceOtherCtrl: [''], // new field
        adaptationActionIndicatorTimeCtrl: ['', [Validators.required]],
        timeSeriesAvailableEndCtrl: ['', [Validators.required]], // new field
        adaptationActionIndicatorCoverageCtrl: ['', [Validators.required]],
        adaptationActionIndicatorCoverageOtherCtrl: [''], // new field
        adaptationActionIndicatorDisintegrationCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorLimitCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorMeasurementCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorDetailsCtrl: ['', [Validators.maxLength(1000)]],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorResponsibleInstitutionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorSourceTypeCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceTypeOtherCtrl: [''], // new field
        adaptationActionIndicatorOperationNameCtrl: ['', [Validators.maxLength(300)]],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorSourceDataCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceDataOtherCtrl: [''],
        adaptationActionIndicatorClassifiersCtrl: ['', [Validators.required]],
        adaptationActionIndicatorClassifiersOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorContactNameCtrl: ['', [Validators.required]],
        adaptationActionIndicatorContactInstitutionCtrl: ['', [Validators.required]],
        adaptationActionIndicatorContactDepartmentCtrl: ['', [Validators.required]],
        adaptationActionIndicatorContactEmailCtrl: ['', [Validators.required, Validators.email]],
        adaptationActionIndicatorContactPhoneCtrl: [
          '',
          [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
        ],
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
    this.mainStepper.next();
  }

  buildPayload() {
    const context = {
      indicator: {
        name: this.form.value.formArray[0].adaptationActionIndicatorNameCtrl,
        description: this.form.value.formArray[0].adaptationActionIndicatorDescriptionCtrl,
        unit: this.form.value.formArray[0].adaptationActionIndicatorUnitCtrl,
        methodological_detail: this.form.value.formArray[0].adaptationActionIndicatorMetodologyCtrl,
        reporting_periodicity: this.form.value.formArray[0].adaptationActionIndicatorFrecuenceCtrl,
        geographic_coverage: this.form.value.formArray[0].adaptationActionIndicatorCoverageCtrl,
        other_geographic_coverage: this.form.value.formArray[0].adaptationActionIndicatorCoverageOtherCtrl,
        disaggregation: this.form.value.formArray[0].adaptationActionIndicatorDisintegrationCtrl,
        limitation: this.form.value.formArray[0].adaptationActionIndicatorLimitCtrl,
        additional_information: this.form.value.formArray[0].adaptationActionIndicatorMeasurementCtrl,
        comments: this.form.value.formArray[0].adaptationActionIndicatorDetailsCtrl,
        available_time_start_date: this.datePipe.transform(
          this.form.value.formArray[0].adaptationActionIndicatorTimeCtrl,
          'yyyy-MM-dd'
        ),
        information_source: {
          responsible_institution: this.form.value.formArray[1].adaptationActionIndicatorResponsibleInstitutionCtrl,
          type_information: this.form.value.formArray[1].adaptationActionIndicatorSourceTypeCtrl,
          Other_type: this.form.value.formArray[1].adaptationActionIndicatorSourceTypeOtherCtrl,
          statistical_operation: this.form.value.formArray[1].adaptationActionIndicatorOperationNameCtrl,
        },
        type_of_data: this.form.value.formArray[2].adaptationActionIndicatorSourceDataCtrl,
        other_type_of_data: this.form.value.formArray[2].adaptationActionIndicatorSourceDataOtherCtrl,
        classifier: [this.form.value.formArray[2].adaptationActionIndicatorClassifiersCtrl],
        other_classifier: this.form.value.formArray[2].adaptationActionIndicatorClassifiersOtherCtrl,
      },
    };

    return context;
  }
}
