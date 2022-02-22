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
  indicatorToolTipTxt =
    'Los indicadores pueden ser del tipo Gestión: permiten medir la cantidad de bienes y servicios generados, así como el grado de avance de acciones climáticas a nivel de insumos, actividades y productos, centrándose en aspectos relevantes y evitar medir aspectos rutinarios y operativos o Resultados: se refiere a la medición de efectos e impactos logrados por alguna intervención, o bien, por causa de la crisis climática';

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
        adaptationActionIndicatorNameCtrl: ['', [Validators.required, Validators.maxLength(100)]],
        adaptationActionIndicatorDescriptionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorUnitCtrl: ['', [Validators.required, Validators.maxLength(50)]],
        adaptationActionIndicatorMetodologyCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionIndicatorFrecuenceCtrl: ['', [Validators.required]],
        adaptationActionIndicatorStartDateCtrl: ['', [Validators.required]],
        adaptationActionIndicatorEndDateCtrl: ['', [Validators.required]],
        adaptationActionIndicatorTimeCtrl: ['', [Validators.required]],
        adaptationActionIndicatorCoverageCtrl: ['', [Validators.required]],
        adaptationActionIndicatorDisintegrationCtrl: ['', [Validators.required, Validators.maxLength(150)]],
        adaptationActionIndicatorLimitCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        adaptationActionIndicatorMeasurementCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorDetailsCtrl: ['', [Validators.required, Validators.maxLength(300)]],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorResponsibleInstitutionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorSourceTypeCtrl: ['', [Validators.required]],
        adaptationActionIndicatorOperationNameCtrl: ['', [Validators.required, Validators.maxLength(300)]],
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
          [Validators.required, Validators.maxLength(6), Validators.minLength(6)],
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

    /*
		this.service
			.updateNewAdaptationAction(payload, this.adaptationAction.id)
			.subscribe(_ => {
				this.openSnackBar("Formulario creado correctamente", "");
				this.mainStepper.next();
			});

			*/
  }

  buildPayload() {
    const context = {
      indicator: {
        name: this.form.value.formArray[0].adaptationActionIndicatorNameCtrl,
        description: this.form.value.formArray[0].adaptationActionIndicatorDescriptionCtrl,
        unit: this.form.value.formArray[0].adaptationActionIndicatorUnitCtrl,
        methodological_detail: this.form.value.formArray[0].adaptationActionIndicatorMetodologyCtrl,
        reporting_periodicity: this.form.value.formArray[0].adaptationActionIndicatorFrecuenceCtrl,
        available_time_start_date: this.datePipe.transform(
          this.form.value.formArray[0].adaptationActionIndicatorStartDateCtrl,
          'yyyy-MM-dd'
        ),

        geographic_coverage: this.form.value.formArray[0].adaptationActionIndicatorCoverageCtrl,
        other_geographic_coverage: '',
        disaggregation: this.form.value.formArray[0].adaptationActionIndicatorDisintegrationCtrl,
        limitation: this.form.value.formArray[0].adaptationActionIndicatorLimitCtrl,
        additional_information: this.form.value.formArray[0].adaptationActionIndicatorMeasurementCtrl,
        comments: this.form.value.formArray[0].adaptationActionIndicatorDetailsCtrl,

        information_source: {
          responsible_institution: this.form.value.formArray[1].adaptationActionIndicatorResponsibleInstitutionCtrl,
          type_information: this.form.value.formArray[1].adaptationActionIndicatorSourceTypeCtrl,
          Other_type: '',
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
