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
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;
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
      formArray: !this.edit ? this.buildRegisterForm() : this.buildUpdateRegisterForm(),
    });
  }

  addNewForm() {
    const index = Object.keys(this.form.controls).length + 1;
    this.form.controls['formArray' + index] = this.buildRegisterForm();
  }

  removeForm(key: string) {
    delete this.form.controls[key];
  }

  getFormKeys() {
    return Object.keys(this.form.controls);
  }

  getFormObject(key: string) {
    return this.form.get(key);
  }

  buildUpdateRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionIndicatorNameCtrl: [
          this.adaptationActionUpdated.indicator.name,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionIndicatorDescriptionCtrl: [
          this.adaptationActionUpdated.indicator.description,
          [Validators.required, Validators.maxLength(500)],
        ],
        adaptationActionIndicatorUnitCtrl: [
          this.adaptationActionUpdated.indicator.unit,
          [Validators.required, Validators.maxLength(100)],
        ],
        adaptationActionIndicatorMetodologyCtrl: [
          this.adaptationActionUpdated.indicator.methodological_detail,
          [Validators.required, Validators.maxLength(500)],
        ],
        adaptationActionIndicatorUnitFileCtrl: [''], // new field
        adaptationActionIndicatorFrecuenceCtrl: [
          this.adaptationActionUpdated.indicator.reporting_periodicity,
          [Validators.required],
        ],
        adaptationActionIndicatorFrecuenceOtherCtrl: [''], // new field
        adaptationActionIndicatorTimeCtrl: [
          this.adaptationActionUpdated.indicator.available_time_start_date,
          [Validators.required],
        ],
        timeSeriesAvailableEndCtrl: [
          this.adaptationActionUpdated.indicator.available_time_end_date,
          [Validators.required],
        ], // new field
        adaptationActionIndicatorCoverageCtrl: [
          this.adaptationActionUpdated.indicator.geographic_coverage,
          [Validators.required],
        ],
        adaptationActionIndicatorCoverageOtherCtrl: [''], // new field
        adaptationActionIndicatorDisintegrationCtrl: [
          this.adaptationActionUpdated.indicator.disaggregation,
          [Validators.maxLength(1000)],
        ],
        adaptationActionIndicatorLimitCtrl: [
          this.adaptationActionUpdated.indicator.limitation,
          [Validators.maxLength(1000)],
        ],
        adaptationActionIndicatorMeasurementCtrl: [
          this.adaptationActionUpdated.indicator.additional_information,
          [Validators.maxLength(1000)],
        ],
        adaptationActionIndicatorDetailsCtrl: [
          this.adaptationActionUpdated.indicator.comments,
          [Validators.maxLength(1000)],
        ],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorResponsibleInstitutionCtrl: [
          this.adaptationActionUpdated.indicator.information_source.responsible_institution,
          [Validators.required, Validators.maxLength(300)],
        ],
        adaptationActionIndicatorSourceTypeCtrl: [
          this.adaptationActionUpdated.indicator.information_source.type_information,
          [Validators.required],
        ],
        adaptationActionIndicatorSourceTypeOtherCtrl: [
          this.adaptationActionUpdated.indicator.information_source.Other_type,
        ], // new field
        adaptationActionIndicatorOperationNameCtrl: [
          this.adaptationActionUpdated.indicator.information_source.statistical_operation,
          [Validators.maxLength(300)],
        ],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorSourceDataCtrl: [
          this.adaptationActionUpdated.indicator.type_of_data.id,
          [Validators.required],
        ],
        adaptationActionIndicatorSourceDataOtherCtrl: [this.adaptationActionUpdated.indicator.other_type_of_data],
        adaptationActionIndicatorClassifiersCtrl: [
          this.adaptationActionUpdated.indicator.classifier[0].id,
          [Validators.required],
        ],
        adaptationActionIndicatorClassifiersOtherCtrl: [this.adaptationActionUpdated.indicator.other_classifier],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorContactNameCtrl: [
          this.adaptationActionUpdated.indicator.contact.full_name,
          [Validators.required],
        ],
        adaptationActionIndicatorContactInstitutionCtrl: [
          this.adaptationActionUpdated.indicator.contact.institution,
          [Validators.required],
        ],
        adaptationActionIndicatorContactDepartmentCtrl: [
          this.adaptationActionUpdated.indicator.contact.job_title,
          [Validators.required],
        ],
        adaptationActionIndicatorContactEmailCtrl: [
          this.adaptationActionUpdated.indicator.contact.email,
          [Validators.required, Validators.email],
        ],
        adaptationActionIndicatorContactPhoneCtrl: [
          this.adaptationActionUpdated.indicator.contact.phone,
          [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
        ],
      }),
    ]);
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
        available_time_end_date: this.datePipe.transform(
          this.form.value.formArray[0].timeSeriesAvailableEndCtrl,
          'yyyy-MM-dd'
        ),
        geographic_coverage: this.form.value.formArray[0].adaptationActionIndicatorCoverageCtrl,
        other_geographic_coverage: this.form.value.formArray[0].adaptationActionIndicatorCoverageOtherCtrl
          ? this.form.value.formArray[0].adaptationActionIndicatorCoverageOtherCtrl
          : null,
        disaggregation: this.form.value.formArray[0].adaptationActionIndicatorDisintegrationCtrl
          ? this.form.value.formArray[0].adaptationActionIndicatorDisintegrationCtrl
          : null,
        limitation: this.form.value.formArray[0].adaptationActionIndicatorLimitCtrl
          ? this.form.value.formArray[0].adaptationActionIndicatorLimitCtrl
          : null,
        additional_information: this.form.value.formArray[0].adaptationActionIndicatorMeasurementCtrl
          ? this.form.value.formArray[0].adaptationActionIndicatorMeasurementCtrl
          : null,
        comments: this.form.value.formArray[0].adaptationActionIndicatorDetailsCtrl
          ? this.form.value.formArray[0].adaptationActionIndicatorDetailsCtrl
          : null,
        available_time_start_date: this.datePipe.transform(
          this.form.value.formArray[0].adaptationActionIndicatorTimeCtrl,
          'yyyy-MM-dd'
        ),
        information_source: {
          responsible_institution: this.form.value.formArray[1].adaptationActionIndicatorResponsibleInstitutionCtrl,
          type_information: this.form.value.formArray[1].adaptationActionIndicatorSourceTypeCtrl,
          Other_type: this.form.value.formArray[1].adaptationActionIndicatorSourceTypeOtherCtrl
            ? this.form.value.formArray[1].adaptationActionIndicatorSourceTypeOtherCtrl
            : null,
          statistical_operation: this.form.value.formArray[1].adaptationActionIndicatorOperationNameCtrl,
        },
        type_of_data: this.form.value.formArray[2].adaptationActionIndicatorSourceDataCtrl,
        other_type_of_data: this.form.value.formArray[2].adaptationActionIndicatorSourceDataOtherCtrl
          ? this.form.value.formArray[2].adaptationActionIndicatorSourceDataOtherCtrl
          : null,
        classifier: [this.form.value.formArray[2].adaptationActionIndicatorClassifiersCtrl],
        other_classifier: this.form.value.formArray[2].adaptationActionIndicatorClassifiersOtherCtrl
          ? this.form.value.formArray[2].adaptationActionIndicatorClassifiersOtherCtrl
          : null,

        contact: {
          institution: this.form.value.formArray[3].adaptationActionIndicatorContactInstitutionCtrl,
          full_name: this.form.value.formArray[3].adaptationActionIndicatorContactNameCtrl,
          job_title: this.form.value.formArray[3].adaptationActionIndicatorContactDepartmentCtrl,
          email: this.form.value.formArray[3].adaptationActionIndicatorContactEmailCtrl,
          phone: this.form.value.formArray[3].adaptationActionIndicatorContactPhoneCtrl,
        },
      },
    };

    return context;
  }
}
