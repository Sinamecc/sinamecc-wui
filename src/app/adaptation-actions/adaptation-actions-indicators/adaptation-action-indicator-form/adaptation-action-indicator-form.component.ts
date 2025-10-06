import { DatePipe } from '@angular/common';
import { Component, Inject, inject, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '@app/adaptation-actions/adaptation-actions-service';
import { AdaptationAction } from '@app/adaptation-actions/interfaces/adaptationAction';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';

export interface DialogData {
  adaptationAction: AdaptationAction;
  indicator?: number;
  edit: boolean;
}

@Component({
  selector: 'app-adaptation-action-indicator-form',
  templateUrl: './adaptation-action-indicator-form.component.html',
  styleUrl: './adaptation-action-indicator-form.component.scss',
  standalone: false,
})
export class AdaptationActionIndicatorFormComponent {
  readonly dialogRef = inject(MatDialogRef<AdaptationActionIndicatorFormComponent>);
  private destroy$ = new Subject<void>();
  form: UntypedFormGroup;
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
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private service: AdaptationActionService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  ngOnInit() {
    this.createForm();
    this.changeContactValidators();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private changeContactValidators() {
    const group = this.formArray?.get([3]) as FormGroup;
    const sameContactCtrl = group?.get('sameContactCtrl');

    sameContactCtrl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => {
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

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    if (!this.data.edit) {
      this.form = this.fb.group({
        formArray: this.buildRegisterForm(),
      });
    } else {
      this.buildUpdateRegisterForm();
    }
  }

  buildUpdateRegisterForm() {
    if (this.data.adaptationAction.indicator_list.length > 0) {
      let index = 0;
      for (const indicator of this.data.adaptationAction.indicator_list) {
        const timeSeriesAvailableEnd = new Date(indicator.available_time_end_date);
        const adaptationActionIndicatorTime = new Date(indicator.available_time_start_date);

        timeSeriesAvailableEnd.setMinutes(
          timeSeriesAvailableEnd.getMinutes() + timeSeriesAvailableEnd.getTimezoneOffset(),
        );

        adaptationActionIndicatorTime.setMinutes(
          adaptationActionIndicatorTime.getMinutes() + adaptationActionIndicatorTime.getTimezoneOffset(),
        );

        const form = this.fb.array([
          this.fb.group({
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
          this.fb.group({
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
          this.fb.group({
            adaptationActionIndicatorSourceDataCtrl: [indicator.type_of_data.id, [Validators.required]],
            adaptationActionIndicatorSourceDataOtherCtrl: [indicator.other_type_of_data],
            adaptationActionIndicatorClassifiersCtrl: [indicator.classifier[0].id, [Validators.required]],
            adaptationActionIndicatorClassifiersOtherCtrl: [indicator.other_classifier],
          }),
          this.fb.group({
            sameContactCtrl: [Boolean(indicator.same_contact_info_as_registration), [Validators.required]],
            adaptationActionIndicatorContactNameCtrl: [indicator.contact.contact_name],
            adaptationActionIndicatorContactInstitutionCtrl: [indicator.contact.institution],
            adaptationActionIndicatorContactDepartmentCtrl: [indicator.contact.contact_position],
            adaptationActionIndicatorContactEmailCtrl: [indicator.contact.email],
            adaptationActionIndicatorContactPhoneCtrl: [indicator.contact.phone],
          }),
        ]);
        if (index === 0) {
          this.form = this.fb.group({
            formArray: form,
          });
        } else {
          this.form.controls['formArray' + index] = form;
        }

        index += 1;
      }
    } else {
      this.form = this.fb.group({
        formArray: this.buildRegisterForm(),
      });
    }
  }

  buildRegisterForm() {
    return this.fb.array([
      this.fb.group({
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
      this.fb.group({
        adaptationActionIndicatorResponsibleInstitutionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
        adaptationActionIndicatorSourceTypeCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceTypeOtherCtrl: [''],
        adaptationActionIndicatorOperationNameCtrl: ['', [Validators.maxLength(300)]],
      }),
      this.fb.group({
        adaptationActionIndicatorSourceDataCtrl: ['', [Validators.required]],
        adaptationActionIndicatorSourceDataOtherCtrl: [''],
        adaptationActionIndicatorClassifiersCtrl: ['', [Validators.required]],
        adaptationActionIndicatorClassifiersOtherCtrl: [''],
      }),
      this.fb.group({
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
      duration: 3000,
    });
  }

  submitForm() {
    let service: (payload: any) => Observable<any>;

    if (this.data.edit) {
      service = (payload) => this.service.updateIndicator(this.data.indicator, payload);
    } else {
      service = (payload) => this.service.createIndicator(payload);
    }

    const payload = this.buildPayload();
    service(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const indicator = response.body;
          if (this.data.edit) {
            this.data.adaptationAction.indicator_list = this.data.adaptationAction.indicator_list.map((ind) =>
              ind.id === indicator.id ? indicator : ind,
            );
          } else {
            this.data.adaptationAction.indicator_list.push(indicator);
          }

          this.translateService
            .get('specificLabel.saveInformation')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: string) => {
                this.snackBar.open(res, null, { duration: 3000 });
                this.dialogRef.close(this.data.adaptationAction);
              },
            });
        },
        error: () => {
          this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
        },
      });
  }

  buildPayload() {
    const formArray = this.form.get('formArray') as FormArray;

    const indicator = {
      adaptation_action: this.data.adaptationAction.id,
      name: formArray.at(0).get('adaptationActionIndicatorNameCtrl')?.value,
      description: formArray.at(0).get('adaptationActionIndicatorDescriptionCtrl')?.value,
      unit: formArray.at(0).get('adaptationActionIndicatorUnitCtrl')?.value,
      methodological_detail: formArray.at(0).get('adaptationActionIndicatorMetodologyCtrl')?.value,
      reporting_periodicity: formArray.at(0).get('adaptationActionIndicatorFrecuenceCtrl')?.value,
      available_time_end_date: this.datePipe.transform(
        formArray.at(0).get('timeSeriesAvailableEndCtrl')?.value,
        'yyyy-MM-dd',
      ),
      geographic_coverage: formArray.at(0).get('adaptationActionIndicatorCoverageCtrl')?.value,
      associated_meta: formArray.at(0).get('adaptationActionIndicatorGoalCtrl')?.value,
      other_geographic_coverage: formArray.at(0).get('adaptationActionIndicatorCoverageOtherCtrl')?.value || null,
      disaggregation: formArray.at(0).get('adaptationActionIndicatorDisintegrationCtrl')?.value || null,
      limitation: formArray.at(0).get('adaptationActionIndicatorLimitCtrl')?.value || null,
      additional_information: formArray.at(0).get('adaptationActionIndicatorMeasurementCtrl')?.value || null,
      comments: formArray.at(0).get('adaptationActionIndicatorDetailsCtrl')?.value || null,
      indicator_base_line: formArray.at(0).get('indicatorBaselineCtrl')?.value,
      available_time_start_date: this.datePipe.transform(
        formArray.at(0).get('adaptationActionIndicatorTimeCtrl')?.value,
        'yyyy-MM-dd',
      ),

      information_source: {
        responsible_institution: formArray.at(1).get('adaptationActionIndicatorResponsibleInstitutionCtrl')?.value,
        type_information: formArray.at(1).get('adaptationActionIndicatorSourceTypeCtrl')?.value,
        other_type: formArray.at(1).get('adaptationActionIndicatorSourceTypeOtherCtrl')?.value || null,
        statistical_operation: formArray.at(1).get('adaptationActionIndicatorOperationNameCtrl')?.value,
      },

      type_of_data: formArray.at(2).get('adaptationActionIndicatorSourceDataCtrl')?.value,
      other_type_of_data: formArray.at(2).get('adaptationActionIndicatorSourceDataOtherCtrl')?.value || null,
      classifier: [formArray.at(2).get('adaptationActionIndicatorClassifiersCtrl')?.value],
      other_classifier: formArray.at(2).get('adaptationActionIndicatorClassifiersOtherCtrl')?.value || null,

      same_contact_info_as_registration: formArray.at(3).get('sameContactCtrl')?.value,
      contact: {
        contact_name: formArray.at(3).get('sameContactCtrl')?.value
          ? null
          : formArray.at(3).get('adaptationActionIndicatorContactNameCtrl')?.value,
        institution: formArray.at(3).get('sameContactCtrl')?.value
          ? null
          : formArray.at(3).get('adaptationActionIndicatorContactInstitutionCtrl')?.value,
        contact_position: formArray.at(3).get('sameContactCtrl')?.value
          ? null
          : formArray.at(3).get('adaptationActionIndicatorContactDepartmentCtrl')?.value,
        email: formArray.at(3).get('sameContactCtrl')?.value
          ? null
          : formArray.at(3).get('adaptationActionIndicatorContactEmailCtrl')?.value,
        phone: formArray.at(3).get('sameContactCtrl')?.value
          ? null
          : formArray.at(3).get('adaptationActionIndicatorContactPhoneCtrl')?.value,
      },
    };

    if (this.data.edit && this.data.indicator) {
      indicator['id'] = this.data.indicator;
    }

    return indicator;
  }
}
