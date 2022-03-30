import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-general-register',
  templateUrl: './general-register.component.html',
  styleUrls: ['./general-register.component.scss'],
})
export class GeneralRegisterComponent implements OnInit {
  form: FormGroup;
  @Input() mainStepper: any;

  durationInSeconds = 5;

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private datePipe: DatePipe
  ) {}

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

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        reportingEntityTypeCtrl: ['', Validators.required],
        reportingEntityTypeOtherCtrl: [''],
        entityResponsibleReportingCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        legalIdentificationCtrl: ['', [Validators.maxLength(10)]],
        reportPreparationDateCtrl: ['', Validators.required],
        nameContactPersonCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        titleResponsibleReportingCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        emailCtrl: ['', [Validators.required, Validators.email]],
        phoneCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
        entityAddress: ['', [Validators.required, Validators.maxLength(250)]],
      }),
    ]);
  }

  submitForm() {
    const payload: AdaptationAction = {
      report_organization: this.buildPayload(),
    };

    this.service.updateCurrentAdaptationAction(payload);
    this.mainStepper.next();
    /*
		this.service.createNewAdaptationAction(payload).subscribe(_ => {
			this.openSnackBar("Formulario creado correctamente", "");
			this.mainStepper.next();
		});
		*/
  }

  buildPayload() {
    const context = {
      responsible_entity: this.form.value.formArray[0].entityResponsibleReportingCtrl,
      legal_identification: this.form.value.formArray[0].legalIdentificationCtrl,
      elaboration_date: this.datePipe.transform(this.form.value.formArray[0].reportPreparationDateCtrl, 'yyyy-MM-dd'),
      entity_address: this.form.value.formArray[0].entityAddress,
      report_organization_type: this.form.value.formArray[0].reportingEntityTypeCtrl,
      other_report_organization_type: this.form.value.formArray[0].reportingEntityTypeOtherCtrl,
      contact: this.form.value.formArray[0].nameContactPersonCtrl,
    };
    return context;
  }
}
