import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData, InitiativeType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';
import { ErrorReportingComponent } from '@shared';
import { DatePipe } from '@angular/common';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-initiative-form',
  templateUrl: './initiative-form.component.html',
  styleUrls: ['./initiative-form.component.scss'],
})
export class InitiativeFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  isLinear = true;
  wasSubmittedSuccessfully = false;
  initiativeTypes: InitiativeType[];
  displayFinancialSource: boolean;
  startDate = new Date();

  mitigationAction: MitigationAction;
  initiativeGoalList: string[] = [];

  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  // @Input() action: string;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;
  @Input() action: string;

  ndcList: Object[] = [];

  ejeList: Object[] = [];

  section5TooltipTxt =
    'Se sugiere revisar el siguiente link para obtener detalle sobre las relación con la categorización que debe hacer en esta subsección https://docs.google.com/spreadsheets/d/17rrTYpiLsargiTnARd29HLoSOaRUYtXd/edit?usp=sharing&ouid=100093507902776240980&rtpof=true&sd=true';

  temasList = [
    {
      name: 'Transporte',
      options: [
        { name: 'Transporte público' },
        { name: 'Transporte de carga' },
        { name: 'Movilidad  sostenible' },
        { name: 'Electrificación del transporte' },
        { name: 'Tecnologías cero emisiones' },
        { name: 'Mejoramiento de Combustibles' },
      ],
    },
    {
      name: 'Energía',
      options: [
        { name: 'Energías renovables' },
        { name: 'Eficiencia energética' },
        {
          name: 'Políticas, leyes e investigación para la transición energética',
        },
        { name: 'Mejoramiento y sustitución de combustibles ' },
      ],
    },

    {
      name: 'Ambiente',
      options: [{ name: 'Manejo Forestal' }],
    },
  ];

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    // this.formData = new FormData();
    this.isLoading = true;
    this.isUpdating = this.action === 'update';
    this.displayFinancialSource = false;
    this.createForm();
  }

  loadSubNDCcatalogs(id: string) {
    this.service.loadCatalogs(id, 'action-areas', 'action-goal').subscribe((response) => {
      this.ndcList = response;
    });
  }

  loadSubDescarbonizatiocatalogs(id: string) {
    this.service.loadCatalogs(id, 'descarbonization-axis', 'transformational-visions').subscribe((response) => {
      this.ejeList = response;
    });
  }

  ngOnInit() {
    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe((message) => {
        this.mitigationAction = message;
        this.updateFormData();
      });
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          initiativeTypeCtrl: ['', Validators.required],
          initiativeNameCtrl: ['', [Validators.required, Validators.maxLength(200)]],
          initiativeObjectiveCtrl: ['', [Validators.required, Validators.maxLength(100)]],
          initiativeDescriptionCtrl: ['', [Validators.required, Validators.maxLength(1000)]],
          initiativeGoalCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        }),
        this.formBuilder.group({
          entityReportingCtrl: ['', [Validators.required, Validators.maxLength(50)]],
          initiativeContactNameCtrl: ['', [Validators.required, Validators.maxLength(40)]],
          initiativePositionCtrl: ['', [Validators.required, Validators.maxLength(100)]],
          initiativeEmailFormCtrl: ['', Validators.email],
          initiativePhoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
        this.formBuilder.group({
          deploymentCompletionIdCtrl: ['', Validators.required],
          deploymentCompletionDateCtrl: [''],
          deploymentCompletionOtherCtrl: [''],
          initiativeStatusCtrl: ['', Validators.required],
          startImplementationCtrl: ['', Validators.required],
          deploymentCompletionCtrl: [''],
          entityResponsibleMitigationActionCtrl: ['', [Validators.required, Validators.minLength(1)]],
          entitiesInvolvedMitigationActionCtrl: ['', [Validators.required, Validators.minLength(1)]],
        }),
        this.formBuilder.group({
          geographicScaleCtrl: ['', Validators.required],
          locationActionCtrl: ['', Validators.minLength(1)],
        }),
        this.formBuilder.group({
          relationshipNDCCtrl: ['', Validators.required],
          relationshipNDCTopicCtrl: ['', Validators.required],
          relationshipDecarbonizationPlanCtrl: ['', Validators.required],
          relationshipDecarbonizationTopicPlanCtrl: ['', Validators.required],
          impactCategoryCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersQuestionCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersCtrl: [''],
        }),
      ]),
    });
  }

  private updateFormData() {
    this.initiativeGoalList.concat(this.mitigationAction.initiative.goal.map((x: { goal: any }) => x.goal));
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          initiativeTypeCtrl: [this.mitigationAction.initiative.initiative_type.id, Validators.required],
          initiativeNameCtrl: [this.mitigationAction.initiative.name, [Validators.required, Validators.maxLength(200)]],
          initiativeObjectiveCtrl: [
            this.mitigationAction.initiative.objective,
            [Validators.required, Validators.maxLength(100)],
          ],
          initiativeDescriptionCtrl: [
            this.mitigationAction.initiative.description,
            [Validators.required, Validators.maxLength(1000)],
          ],
          initiativeGoalCtrl: [
            this.mitigationAction.initiative.goal[0].goal,
            [Validators.required, Validators.maxLength(500)],
          ],
        }),
        this.formBuilder.group({
          entityReportingCtrl: [
            this.mitigationAction.contact.institution,
            [Validators.required, Validators.maxLength(50)],
          ],
          initiativeContactNameCtrl: [
            this.mitigationAction.contact.full_name,
            [Validators.required, Validators.maxLength(40)],
          ],
          initiativePositionCtrl: [
            this.mitigationAction.contact.job_title,
            [Validators.required, Validators.maxLength(100)],
          ],
          initiativeEmailFormCtrl: [this.mitigationAction.contact.email, Validators.email],
          initiativePhoneCtrl: [
            this.mitigationAction.contact.phone,
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
        }),
        this.formBuilder.group({
          deploymentCompletionIdCtrl: ['', Validators.required],
          deploymentCompletionDateCtrl: [this.mitigationAction.status_information.end_date],
          deploymentCompletionOtherCtrl: [
            this.mitigationAction.status_information.other_end_date
              ? this.mitigationAction.status_information.other_end_date
              : '',
          ],
          initiativeStatusCtrl: [this.mitigationAction.status_information.status.id, Validators.required],
          startImplementationCtrl: [this.mitigationAction.status_information.start_date, Validators.required],
          deploymentCompletionCtrl: [''],
          entityResponsibleMitigationActionCtrl: [
            this.mitigationAction.status_information.institution,
            [Validators.required, Validators.minLength(1)],
          ],
          entitiesInvolvedMitigationActionCtrl: [
            this.mitigationAction.status_information.other_institution,
            [Validators.required, Validators.minLength(1)],
          ],
        }),
        this.formBuilder.group({
          geographicScaleCtrl: [this.mitigationAction.geographic_location.geographic_scale.id, Validators.required],
          locationActionCtrl: [this.mitigationAction.geographic_location.location, Validators.minLength(1)],
        }),
        this.formBuilder.group({
          relationshipNDCCtrl: ['', Validators.required],
          relationshipNDCTopicCtrl: ['', Validators.required],
          relationshipDecarbonizationPlanCtrl: ['', Validators.required],
          relationshipDecarbonizationTopicPlanCtrl: ['', Validators.required],
          impactCategoryCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersQuestionCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersCtrl: [''],
        }),
      ]),
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  buildInitiativeGoal() {
    const goals = [];
    if (this.initiativeGoalList.length < 1) {
      goals.push({ goal: this.form.value.formArray[0].initiativeGoalCtrl });
    } else {
      for (const goal of this.initiativeGoalList) {
        goals.push({ goal: goal });
      }
    }

    return goals;
  }

  buildPayload() {
    const payload = {
      status_information: {
        status: this.form.value.formArray[2].initiativeStatusCtrl,
        start_date: this.datePipe.transform(this.form.value.formArray[2].startImplementationCtrl, 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.form.value.formArray[2].deploymentCompletionDateCtrl, 'yyyy-MM-dd'),
        other_end_date:
          this.form.value.formArray[2].deploymentCompletionOtherCtrl !== ''
            ? this.form.value.formArray[2].deploymentCompletionOtherCtrl
            : null,
        institution: this.form.value.formArray[2].entityResponsibleMitigationActionCtrl,
        other_institution: this.form.value.formArray[2].entitiesInvolvedMitigationActionCtrl,
      },
      geographic_location: {
        geographic_scale: this.form.value.formArray[3].geographicScaleCtrl,
        location: this.form.value.formArray[3].locationActionCtrl,
      },
      initiative: {
        name: this.form.value.formArray[0].initiativeNameCtrl,
        objective: this.form.value.formArray[0].initiativeObjectiveCtrl,
        description: this.form.value.formArray[0].initiativeDescriptionCtrl,
        initiative_goal: this.buildInitiativeGoal(),
        initiative_type: this.form.value.formArray[0].initiativeTypeCtrl,
      },
      contact: {
        institution: this.form.value.formArray[1].entityReportingCtrl,
        full_name: this.form.value.formArray[1].initiativeContactNameCtrl,
        job_title: this.form.value.formArray[1].initiativePositionCtrl,
        email: this.form.value.formArray[1].initiativeEmailFormCtrl,
        phone: this.form.value.formArray[1].initiativePhoneCtrl,
      },
      categorization: {
        action_goal: [this.form.value.formArray[4].relationshipDecarbonizationPlanCtrl],
        transformational_vision: [this.form.value.formArray[4].relationshipNDCCtrl],
        sub_topics: this.form.value.formArray[4].relationshipDecarbonizationTopicPlanCtrl,
        activities: this.form.value.formArray[4].relationshipNDCTopicCtrl,
        impact_categories:
          this.form.value.formArray[4].impactCategoryCtrl === '3'
            ? ['1', '2']
            : [this.form.value.formArray[4].impactCategoryCtrl],
        is_part_to_another_mitigation_action:
          this.form.value.formArray[4].descriptionRelationshipMitigationActionOthersQuestionCtrl === '1' ? true : false,
        relation_description: this.form.value.formArray[4].descriptionRelationshipMitigationActionOthersCtrl,
      },
    };
    return payload;
  }

  submitForm() {
    this.isLoading = true;

    const payload = this.buildPayload();

    if (this.isUpdating) {
      /*
			context.initiative["id"] = this.mitigationAction.initiative.id;
			context.initiative.contact[
				"id"
			] = this.mitigationAction.initiative.contact.id;
			context.initiative.finance[
				"id"
			] = this.mitigationAction.initiative.finance.id;
			this.service
				.submitMitigationActionUpdateForm(
					context,
					this.mitigationAction.id,
					this.i18nService.language.split("-")[0]
				)
				.pipe(
					finalize(() => {
						this.form.markAsPristine();
						this.isLoading = false;
					})
				)
				.subscribe(
					response => {
						this.translateService
							.get("Sucessfully submitted form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						this.wasSubmittedSuccessfully = true;
					},
					error => {
						this.translateService
							.get("Error submitting form")
							.subscribe((res: string) => {
								this.snackBar.open(res, null, { duration: 3000 });
							});
						log.debug(`New Mitigation Action Form error: ${error}`);

						this.errorComponent.parseErrors(error);
						this.error = error;
						this.wasSubmittedSuccessfully = false;
					}
				);
		*/
    } else {
      this.service
        .submitMitigationActionNewForm(payload)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.isLoading = false;
          })
        )
        .subscribe(
          (response) => {
            this.translateService.get('Sucessfully submitted form').subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
            this.wasSubmittedSuccessfully = true;
            this.stepper.next();
          },
          (error) => {
            this.translateService.get('Error submitting form').subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
            log.debug(`New Mitigation Action Form error: ${error}`);
            this.errorComponent.parseErrors(error);
            this.error = error;
            this.wasSubmittedSuccessfully = false;
          }
        );
    }
  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status
      .filter((financeSource) => financeSource.status === 'Insured' || financeSource.status === 'Asegurado')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }

  removeGoal(item: string) {
    const index = this.initiativeGoalList.indexOf(item);

    if (index >= 0) {
      this.initiativeGoalList.splice(index, 1);
    }
  }

  wordCounter(text: string) {
    const words = text ? text.split(/\s+/) : 0;
    return words ? words.length : 0;
  }
}
