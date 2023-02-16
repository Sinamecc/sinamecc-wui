import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
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
    private service: AdaptationActionService,
    private translateService: TranslateService
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
    if (!this.edit) {
      this.form = this.formBuilder.group({
        formArray: this.buildRegisterForm(),
      });
    } else {
      this.buildUpdateRegisterForm();
    }
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
    const builderGroup = [];

    if (this.adaptationActionUpdated.indicator_list.length > 0) {
      let index = 0;
      for (const indicator of this.adaptationActionUpdated.indicator_list) {
        const timeSeriesAvailableEnd = new Date(indicator.available_time_end_date);
        const adaptationActionIndicatorTime = new Date(indicator.available_time_start_date);

        timeSeriesAvailableEnd.setMinutes(
          timeSeriesAvailableEnd.getMinutes() + timeSeriesAvailableEnd.getTimezoneOffset()
        );

        adaptationActionIndicatorTime.setMinutes(
          adaptationActionIndicatorTime.getMinutes() + adaptationActionIndicatorTime.getTimezoneOffset()
        );

        const form = this.formBuilder.array([
          this.formBuilder.group({
            id: [indicator.id ? indicator.id : ''],
            adaptationActionIndicatorNameCtrl: [indicator.name, [Validators.required, Validators.maxLength(250)]],
            adaptationActionIndicatorDescriptionCtrl: [
              indicator.description,
              [Validators.required, Validators.maxLength(500)],
            ],
            adaptationActionIndicatorUnitCtrl: [indicator.unit, [Validators.required, Validators.maxLength(100)]],
            adaptationActionIndicatorMetodologyCtrl: [
              indicator.methodological_detail,
              [Validators.required, Validators.maxLength(500)],
            ],
            adaptationActionIndicatorUnitFileCtrl: [''], // new field
            adaptationActionIndicatorFrecuenceCtrl: [indicator.reporting_periodicity, [Validators.required]],
            adaptationActionIndicatorFrecuenceOtherCtrl: [''], // new field
            adaptationActionIndicatorTimeCtrl: [adaptationActionIndicatorTime, [Validators.required]],
            timeSeriesAvailableEndCtrl: [timeSeriesAvailableEnd, [Validators.required]], // new field
            adaptationActionIndicatorCoverageCtrl: [indicator.geographic_coverage, [Validators.required]],
            adaptationActionIndicatorCoverageOtherCtrl: [''], // new field
            adaptationActionIndicatorDisintegrationCtrl: [indicator.disaggregation, [Validators.maxLength(1000)]],
            adaptationActionIndicatorLimitCtrl: [indicator.limitation, [Validators.maxLength(1000)]],
            adaptationActionIndicatorMeasurementCtrl: [indicator.additional_information, [Validators.maxLength(1000)]],
            adaptationActionIndicatorDetailsCtrl: [indicator.comments, [Validators.maxLength(1000)]],
            //indicatorBaselineCtrl: ['', [Validators.maxLength(500)]], // new field
          }),
          this.formBuilder.group({
            adaptationActionIndicatorResponsibleInstitutionCtrl: [
              indicator.information_source.responsible_institution,
              [Validators.required, Validators.maxLength(300)],
            ],
            adaptationActionIndicatorSourceTypeCtrl: [
              indicator.information_source.type_information.map((x: { id: any }) => x.id),
              [Validators.required],
            ],
            adaptationActionIndicatorSourceTypeOtherCtrl: [indicator.information_source.other_type], // new field
            adaptationActionIndicatorOperationNameCtrl: [
              indicator.information_source.statistical_operation,
              [Validators.maxLength(300)],
            ],
          }),
          this.formBuilder.group({
            adaptationActionIndicatorSourceDataCtrl: [indicator.type_of_data.id, [Validators.required]],
            adaptationActionIndicatorSourceDataOtherCtrl: [indicator.other_type_of_data],
            adaptationActionIndicatorClassifiersCtrl: [indicator.classifier[0].id, [Validators.required]],
            adaptationActionIndicatorClassifiersOtherCtrl: [indicator.other_classifier],
          }),
          this.formBuilder.group({
            adaptationActionIndicatorContactNameCtrl: [indicator.contact.contact_name, [Validators.required]],
            adaptationActionIndicatorContactInstitutionCtrl: [indicator.contact.institution, [Validators.required]],
            adaptationActionIndicatorContactDepartmentCtrl: [indicator.contact.contact_position, [Validators.required]],
            adaptationActionIndicatorContactEmailCtrl: [
              indicator.contact.email,
              [Validators.required, Validators.email],
            ],
            adaptationActionIndicatorContactPhoneCtrl: [
              indicator.contact.phone,
              [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
            ],
          }),
        ]);
        if (index === 0) {
          this.form = this.formBuilder.group({
            formArray: form,
          });
        } else {
          this.form.controls['formArray' + index] = form;
        }

        index += 1;
      }
    } else {
      this.form = this.formBuilder.group({
        formArray: this.buildRegisterForm(),
      });
    }
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
        //indicatorBaselineCtrl: ['', [Validators.maxLength(500)]], // new field
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

    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
      (response) => {
        payload.indicator_list = response.body.indicator_list;
        this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
        this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
          this.mainStepper.next();
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      }
    );
  }

  buildPayload() {
    const indicatorList = [];
    const keys = this.getFormKeys();

    for (const key of keys) {
      const form = this.getFormObject(key).value;
      const indicator = {
        name: form[0].adaptationActionIndicatorNameCtrl,
        description: form[0].adaptationActionIndicatorDescriptionCtrl,
        unit: form[0].adaptationActionIndicatorUnitCtrl,
        methodological_detail: form[0].adaptationActionIndicatorMetodologyCtrl,
        reporting_periodicity: form[0].adaptationActionIndicatorFrecuenceCtrl,
        available_time_end_date: this.datePipe.transform(form[0].timeSeriesAvailableEndCtrl, 'yyyy-MM-dd'),
        geographic_coverage: form[0].adaptationActionIndicatorCoverageCtrl,
        other_geographic_coverage: form[0].adaptationActionIndicatorCoverageOtherCtrl
          ? form[0].adaptationActionIndicatorCoverageOtherCtrl
          : null,
        disaggregation: form[0].adaptationActionIndicatorDisintegrationCtrl
          ? form[0].adaptationActionIndicatorDisintegrationCtrl
          : null,
        limitation: form[0].adaptationActionIndicatorLimitCtrl ? form[0].adaptationActionIndicatorLimitCtrl : null,
        additional_information: form[0].adaptationActionIndicatorMeasurementCtrl
          ? form[0].adaptationActionIndicatorMeasurementCtrl
          : null,
        comments: form[0].adaptationActionIndicatorDetailsCtrl ? form[0].adaptationActionIndicatorDetailsCtrl : null,
        available_time_start_date: this.datePipe.transform(form[0].adaptationActionIndicatorTimeCtrl, 'yyyy-MM-dd'),
        information_source: {
          responsible_institution: form[1].adaptationActionIndicatorResponsibleInstitutionCtrl,
          type_information: form[1].adaptationActionIndicatorSourceTypeCtrl,
          other_type: form[1].adaptationActionIndicatorSourceTypeOtherCtrl
            ? form[1].adaptationActionIndicatorSourceTypeOtherCtrl
            : null,
          statistical_operation: form[1].adaptationActionIndicatorOperationNameCtrl,
        },
        type_of_data: form[2].adaptationActionIndicatorSourceDataCtrl,
        other_type_of_data: form[2].adaptationActionIndicatorSourceDataOtherCtrl
          ? form[2].adaptationActionIndicatorSourceDataOtherCtrl
          : null,
        classifier: [form[2].adaptationActionIndicatorClassifiersCtrl],
        other_classifier: form[2].adaptationActionIndicatorClassifiersOtherCtrl
          ? form[2].adaptationActionIndicatorClassifiersOtherCtrl
          : null,

        contact: {
          institution: form[3].adaptationActionIndicatorContactInstitutionCtrl,
          contact_name: form[3].adaptationActionIndicatorContactNameCtrl,
          contact_position: form[3].adaptationActionIndicatorContactDepartmentCtrl,
          email: form[3].adaptationActionIndicatorContactEmailCtrl,
          phone: form[3].adaptationActionIndicatorContactPhoneCtrl,
        },
      };

      if (form[0].id) {
        indicator['id'] = form[0].id;
      }
      indicatorList.push(indicator);
    }

    const context = {
      indicatorList: indicatorList,
      indicator_list: indicatorList,
    };

    return context;
  }
}
