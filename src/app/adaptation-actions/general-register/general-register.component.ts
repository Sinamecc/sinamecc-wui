import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-general-register',
  templateUrl: './general-register.component.html',
  styleUrls: ['./general-register.component.scss'],
})
export class GeneralRegisterComponent implements OnInit {
  form: UntypedFormGroup;
  @Input() mainStepper: any;
  id: string | null;
  adaptationAction: AdaptationAction;

  durationInSeconds = 5;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private translateService: TranslateService
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
    const reportPreparationDate = new Date(this.adaptationAction.report_organization.elaboration_date);
    reportPreparationDate.setMinutes(reportPreparationDate.getMinutes() + reportPreparationDate.getTimezoneOffset());

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
        reportPreparationDateCtrl: [reportPreparationDate, [Validators.required]],
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

    if (this.id) {
      this.service.updateNewAdaptationAction(payload, this.id).subscribe(
        (res) => {
          payload.id = this.id;
          this.service.updateCurrentAdaptationAction(payload);
          this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
            this.mainStepper.next();
          });
        },
        (error) => {
          this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
        }
      );
    } else {
      this.service.createNewAdaptationAction(payload).subscribe(
        (res) => {
          payload.id = res.body.id;
          this.service.updateCurrentAdaptationAction(payload);
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
      legal_identification: this.form.value.formArray[0].legalIdentificationCtrl
        ? this.form.value.formArray[0].legalIdentificationCtrl
        : null,
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
