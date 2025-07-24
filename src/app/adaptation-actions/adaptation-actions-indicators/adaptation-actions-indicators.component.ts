import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adaptation-actions-indicators',
  templateUrl: './adaptation-actions-indicators.component.html',
  styleUrls: ['./adaptation-actions-indicators.component.scss'],
  standalone: false,
})
export class AdaptationActionsIndicatorsComponent implements OnInit {
  @Output() onComplete = new EventEmitter<boolean>();

  form: UntypedFormGroup;
  @Input() mainStepper: any;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;
  durationInSeconds = 3;
  adaptationAction: AdaptationAction;
  typeIndicatorToolTipTxt =
    'Los indicadores pueden ser del tipo Gestión: permiten medir la cantidad de bienes y servicios generados, así como el grado de avance de acciones climáticas a nivel de insumos, actividades y productos, centrándose en aspectos relevantes y evitar medir aspectos rutinarios y operativos o Resultados: se refiere a la medición de efectos e impactos logrados por alguna intervención, o bien, por causa de la crisis climática';
  indicatorToolTipTxt =
    'Un indicador es una expresión cualitativa o cuantitativa, que es observable y permite describir las características de la realidad, a través de la evolución de una variable';

  LOCATION = {
    NATIONAL: 'NATIONAL',
    PROVINCIAL: 'PROVINCIAL',
    CANTONAL: 'CANTONAL',
    DISTRICT: 'DISTRICT',
    OTHER: 'OTHER',
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private service: AdaptationActionService,
    private translateService: TranslateService,
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
      if (
        this.adaptationAction &&
        this.adaptationAction.indicator_list &&
        this.adaptationAction.indicator_list.length
      ) {
        this.onComplete.emit(true);
      }
    });
  }

  ngOnInit() {
    this.createForm();
    this.changeContactValidators();
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

  private changeContactValidators() {
    const group = this.formArray?.get([3]);
    const sameContactCtrl = group?.get('sameContactCtrl');

    sameContactCtrl?.valueChanges.subscribe((value: boolean) => {
      const fieldsToUpdate = [
        'adaptationActionIndicatorContactNameCtrl',
        'adaptationActionIndicatorContactInstitutionCtrl',
        'adaptationActionIndicatorContactDepartmentCtrl',
        'adaptationActionIndicatorContactEmailCtrl',
        'adaptationActionIndicatorContactPhoneCtrl',
      ];

      fieldsToUpdate.forEach((fieldName) => {
        const control = group?.get(fieldName);
        if (!control) return;

        if (value === true) {
          control.clearValidators();
          control.reset();
        } else {
          if (fieldName === 'adaptationActionIndicatorContactEmailCtrl') {
            control.setValidators([Validators.required, Validators.email]);
          } else if (fieldName === 'adaptationActionIndicatorContactPhoneCtrl') {
            control.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
          } else {
            control.setValidators([Validators.required]);
          }
        }

        control.updateValueAndValidity();
      });
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
    if (this.adaptationActionUpdated.indicator_list.length > 0) {
      let index = 0;
      for (const indicator of this.adaptationActionUpdated.indicator_list) {
        const timeSeriesAvailableEnd = new Date(indicator.available_time_end_date);
        const adaptationActionIndicatorTime = new Date(indicator.available_time_start_date);

        timeSeriesAvailableEnd.setMinutes(
          timeSeriesAvailableEnd.getMinutes() + timeSeriesAvailableEnd.getTimezoneOffset(),
        );

        adaptationActionIndicatorTime.setMinutes(
          adaptationActionIndicatorTime.getMinutes() + adaptationActionIndicatorTime.getTimezoneOffset(),
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
            adaptationActionIndicatorUnitFileCtrl: [''],
            adaptationActionIndicatorFrecuenceCtrl: [indicator.reporting_periodicity, [Validators.required]],
            adaptationActionIndicatorFrecuenceOtherCtrl: [''],
            adaptationActionIndicatorTimeCtrl: [adaptationActionIndicatorTime, [Validators.required]],
            timeSeriesAvailableEndCtrl: [timeSeriesAvailableEnd, [Validators.required]],
            adaptationActionIndicatorCoverageCtrl: [indicator.geographic_coverage, [Validators.required]],
            adaptationActionIndicatorCoverageOtherCtrl: [''],
            adaptationActionIndicatorDisintegrationCtrl: [indicator.disaggregation, [Validators.maxLength(1000)]],
            adaptationActionIndicatorLimitCtrl: [indicator.limitation, [Validators.maxLength(1000)]],
            adaptationActionIndicatorGoalCtrl: [
              indicator.associated_meta,
              [Validators.maxLength(100), Validators.required],
            ],
            adaptationActionIndicatorMeasurementCtrl: [indicator.additional_information, [Validators.maxLength(1000)]],
            adaptationActionIndicatorDetailsCtrl: [indicator.comments, [Validators.maxLength(1000)]],
            indicatorBaselineCtrl: [indicator.indicator_base_line, [Validators.maxLength(500)]],
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
            sameContactCtrl: [Boolean(indicator.same_contact_info_as_registration), [Validators.required]],
            adaptationActionIndicatorContactNameCtrl: [indicator.contact.contact_name],
            adaptationActionIndicatorContactInstitutionCtrl: [indicator.contact.institution],
            adaptationActionIndicatorContactDepartmentCtrl: [indicator.contact.contact_position],
            adaptationActionIndicatorContactEmailCtrl: [indicator.contact.email],
            adaptationActionIndicatorContactPhoneCtrl: [indicator.contact.phone],
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
        adaptationActionIndicatorUnitFileCtrl: [''],
        adaptationActionIndicatorFrecuenceCtrl: ['', [Validators.required]],
        adaptationActionIndicatorFrecuenceOtherCtrl: [''],
        adaptationActionIndicatorTimeCtrl: ['', [Validators.required]],
        timeSeriesAvailableEndCtrl: ['', [Validators.required]],
        adaptationActionIndicatorCoverageCtrl: ['', [Validators.required]],
        adaptationActionIndicatorCoverageOtherCtrl: [''],
        adaptationActionIndicatorDisintegrationCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorLimitCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorGoalCtrl: ['', [Validators.maxLength(100), Validators.required]],
        adaptationActionIndicatorMeasurementCtrl: ['', [Validators.maxLength(1000)]],
        adaptationActionIndicatorDetailsCtrl: ['', [Validators.maxLength(1000)]],
        indicatorBaselineCtrl: ['', [Validators.maxLength(500)]],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorResponsibleInstitutionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorSourceTypeCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceTypeOtherCtrl: [''],
        adaptationActionIndicatorOperationNameCtrl: ['', [Validators.maxLength(300)]],
      }),
      this.formBuilder.group({
        adaptationActionIndicatorSourceDataCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceDataOtherCtrl: [''],
        adaptationActionIndicatorClassifiersCtrl: ['', [Validators.required]],
        adaptationActionIndicatorClassifiersOtherCtrl: [''],
      }),
      this.formBuilder.group({
        sameContactCtrl: [false, [Validators.required]],
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
          this.onComplete.emit(true);
          this.mainStepper.next();
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      },
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
        associated_meta: form[0].adaptationActionIndicatorGoalCtrl,
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
        indicator_base_line: form[0].indicatorBaselineCtrl,
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
        same_contact_info_as_registration: form[3].sameContactCtrl,
        contact: {
          contact_name: form[3].sameContactCtrl ? null : form[3].adaptationActionIndicatorContactNameCtrl,
          institution: form[3].sameContactCtrl ? null : form[3].adaptationActionIndicatorContactInstitutionCtrl,
          contact_position: form[3].sameContactCtrl ? null : form[3].adaptationActionIndicatorContactDepartmentCtrl,
          email: form[3].sameContactCtrl ? null : form[3].adaptationActionIndicatorContactEmailCtrl,
          phone: form[3].sameContactCtrl ? null : form[3].adaptationActionIndicatorContactPhoneCtrl,
        },
      };

      if (form[0].id) {
        indicator['id'] = form[0].id;
      }
      indicatorList.push(indicator);
    }

    const context = {
      indicator_list: indicatorList,
    };

    return context;
  }
}
