import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
  id: string | null;
  adaptationAction: AdaptationAction;

  durationInSeconds = 5;

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm();
    if (this.id) {
      this.loadAdaptationAction();
    }
  }

  ngOnInit() {}

  async loadAdaptationAction() {
    const response = await this.service.loadOneAdaptationActions(this.id).toPromise();
    this.service.updateCurrentAdaptationAction(response);
    this.adaptationAction = response;
    this.createUpdatedForm();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.buildRegisterForm(),
    });
  }

  private createUpdatedForm() {
    this.form = this.formBuilder.group({
      formArray: this.buildUpdatedForm(),
    });
  }

  private buildUpdatedForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        reportingEntityTypeCtrl: [
          parseInt(this.adaptationAction.report_organization.report_organization_type.code),
          [Validators.required],
        ],
        reportingEntityTypeOtherCtrl: [
          this.adaptationAction.report_organization.other_report_organization_type
            ? this.adaptationAction.report_organization.other_report_organization_type
            : '',
        ],
        entityResponsibleReportingCtrl: [
          this.adaptationAction.report_organization.responsible_entity,
          [Validators.required, Validators.maxLength(250)],
        ],
        legalIdentificationCtrl: [
          this.adaptationAction.report_organization.legal_identification,
          [Validators.maxLength(10)],
        ],
        reportPreparationDateCtrl: [this.adaptationAction.report_organization.elaboration_date, [Validators.required]],
        nameContactPersonCtrl: [
          this.adaptationAction.report_organization.contact.contact_name,
          [Validators.required, Validators.maxLength(250)],
        ],
        titleResponsibleReportingCtrl: [
          this.adaptationAction.report_organization.contact.contact_position,
          [Validators.required, Validators.maxLength(250)],
        ],
        emailCtrl: [this.adaptationAction.report_organization.contact.email, [Validators.required, Validators.email]],
        phoneCtrl: [
          this.adaptationAction.report_organization.contact.phone,
          [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
        ],
        entityAddress: [
          this.adaptationAction.report_organization.entity_address,
          [Validators.required, Validators.maxLength(250)],
        ],
      }),
    ]);
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
      other_report_organization_type: this.form.value.formArray[0].reportingEntityTypeOtherCtrl
        ? this.form.value.formArray[0].reportingEntityTypeOtherCtrl
        : null,
      contact: {
        contact_name: this.form.value.formArray[0].nameContactPersonCtrl,
        contact_position: this.form.value.formArray[0].titleResponsibleReportingCtrl,
        address: this.form.value.formArray[0].entityAddress,
        email: this.form.value.formArray[0].emailCtrl,
        phone: this.form.value.formArray[0].phoneCtrl,
      },
    };
    return context;
  }
}
