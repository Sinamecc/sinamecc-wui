import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData, InitiativeType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MAFile, MAFileType, MitigationAction } from '../mitigation-action';
import { ErrorReportingComponent } from '@shared';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUpload } from '@app/@shared/upload-button/file-upload';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-initiative-form',
  templateUrl: './initiative-form.component.html',
  styleUrls: ['./initiative-form.component.scss'],
  standalone: false,
})
export class InitiativeFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  isLinear = true;
  wasSubmittedSuccessfully = false;
  initiativeTypes: InitiativeType[];
  displayFinancialSource: boolean;
  startDate = new Date();
  maFileType = MAFileType;

  mitigationAction: MitigationAction;
  initiativeGoalList: string[] = [];

  files: {
    geographic_location: FileUpload;
    initiative: FileUpload;
  } = {
    geographic_location: {
      type: '',
      files: null,
    },
    initiative: {
      type: '',
      files: null,
    },
  };

  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  // @Input() action: string;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;
  @Input() action: string;

  ndcList: any = [];

  ejeList: any = [];

  subTopics: any = [];

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
    private formBuilder: UntypedFormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {
    // this.formData = new FormData();
    this.isLoading = true;
    this.isUpdating = this.action === 'update';
    this.displayFinancialSource = false;
    this.createForm();
  }

  loadSubNDCcatalogs(id: string, index: number) {
    this.service.loadCatalogs(id, 'action-areas', 'action-goal').subscribe((response) => {
      this.ndcList[index] = response;
    });
  }

  loadSubtopics(id: string, index: number) {
    this.service.loadSubTopics(id).subscribe((response) => {
      this.subTopics[index] = response;
    });
  }

  loadSubDescarbonizatiocatalogs(id: string, index: number) {
    this.service.loadCatalogs(id, 'descarbonization-axis', 'transformational-visions').subscribe((response) => {
      this.ejeList[index] = response;
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
          initiativeObjectiveCtrl: ['', [Validators.required, Validators.maxLength(1300)]],
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
          locationActionCtrl: ['', [Validators.required, Validators.minLength(1)]],
        }),
        this.formBuilder.group({
          relationshipCtrl: this.formBuilder.array([this.createNDCctrl()]),
          relationshipDecarbonizationCtrl: this.formBuilder.array([this.createDecarbonizationCtrl()]),
          topicsFrmCtrl: this.formBuilder.array([this.createTopicCtrl()]),
          impactCategoryCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersQuestionCtrl: ['', Validators.required],
          descriptionRelationshipMitigationActionOthersCtrl: [''],
        }),
      ]),
    });
  }

  private createNDCctrl(data: any = null) {
    if (data) {
      const list = [];
      let index = 0;
      for (const element of data) {
        this.loadSubNDCcatalogs(element.area.id, index);
        list.push(
          this.formBuilder.group({
            relationshipNDCCtrl: [element.area.id, Validators.required],
            relationshipNDCTopicCtrl: [element.goals.map((x: any) => x.id.toString()), Validators.required],
          }),
        );

        index = +1;
      }
      return this.formBuilder.array(list);
    }
    return this.formBuilder.group({
      relationshipNDCCtrl: ['', Validators.required],
      relationshipNDCTopicCtrl: ['', Validators.required],
    });
  }

  private createDecarbonizationCtrl(data: any = null) {
    if (data) {
      const list = [];
      let index = 0;

      for (const element of data) {
        this.loadSubDescarbonizatiocatalogs(element.descarbonization_axis.id, index);
        list.push(
          this.formBuilder.group({
            relationshipDecarbonizationPlanCtrl: [element.descarbonization_axis.id, Validators.required],
            relationshipDecarbonizationTopicPlanCtrl: [
              element.transformational_vision.map((x: { id: { toString: () => any } }) => x.id),
              Validators.required,
            ],
          }),
        );

        index = +1;
      }
      return this.formBuilder.array(list);
    }
    return this.formBuilder.group({
      relationshipDecarbonizationPlanCtrl: ['', Validators.required],
      relationshipDecarbonizationTopicPlanCtrl: ['', Validators.required],
    });
  }

  private createTopicCtrl(data: any = null) {
    if (data) {
      const list = [];
      let index = 0;
      for (const element of data) {
        this.loadSubtopics(element.topic.id, index);
        list.push(
          this.formBuilder.group({
            topicCtrl: [element.topic.id, Validators.required],
            subTopicPlanCtrl: [element.sub_topic.map((x: { id: any }) => x.id), Validators.required],
          }),
        );

        index = +1;
      }
      return this.formBuilder.array(list);
    }
    return this.formBuilder.group({
      topicCtrl: ['', Validators.required],
      subTopicPlanCtrl: ['', Validators.required],
    });
  }

  addNDCItem() {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][4].controls['relationshipCtrl'].controls;
    control.push(this.createNDCctrl());
  }

  removeNDCItem(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][4].controls['relationshipCtrl'];
    control.removeAt(index);
  }

  removeDecarbonizationItem(index: number) {
    const control = <UntypedFormArray>(
      this.form.controls.formArray['controls'][4].controls['relationshipDecarbonizationCtrl']
    );
    control.removeAt(index);
  }

  addDecarbonizationtem() {
    const control = <UntypedFormArray>(
      this.form.controls.formArray['controls'][4].controls['relationshipDecarbonizationCtrl'].controls
    );
    control.push(this.createDecarbonizationCtrl());
  }

  removeTopicItem(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][4].controls['topicsFrmCtrl'];
    control.removeAt(index);
  }

  addTopicItem() {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][4].controls['topicsFrmCtrl'].controls;
    control.push(this.createTopicCtrl());
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
            [Validators.required, Validators.maxLength(1000)],
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
          deploymentCompletionIdCtrl: [
            this.mitigationAction.status_information.other_end_date !== '' ? '2' : '1',
            Validators.required,
          ],
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
          relationshipCtrl: this.createNDCctrl(this.mitigationAction.categorization.action_area_selection),
          relationshipDecarbonizationCtrl: this.createDecarbonizationCtrl(
            this.mitigationAction.categorization.descarbonization_axis_selection,
          ),
          topicsFrmCtrl: this.createTopicCtrl(this.mitigationAction.categorization.topics_selection),
          impactCategoryCtrl: ['1', Validators.required],
          descriptionRelationshipMitigationActionOthersQuestionCtrl: [
            this.mitigationAction.categorization.is_part_to_another_mitigation_action ? '1' : '2',
            Validators.required,
          ],
          descriptionRelationshipMitigationActionOthersCtrl: [
            this.mitigationAction.categorization.relation_description,
          ],
        }),
      ]),
    });

    this.isLoading = false;
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
    };
    const actionArea = [];

    for (const element of this.form.controls.formArray['controls'][4].controls['relationshipCtrl'].controls) {
      const newElement = {
        area: element.value.relationshipNDCCtrl,
        goals: element.value.relationshipNDCTopicCtrl,
      };
      actionArea.push(newElement);
    }

    const descarbonizationList = [];
    for (const element of this.form.controls.formArray['controls'][4].controls['relationshipDecarbonizationCtrl']
      .controls) {
      const newElement = {
        descarbonization_axis: element.value.relationshipDecarbonizationPlanCtrl,
        transformational_vision: element.value.relationshipDecarbonizationTopicPlanCtrl,
      };
      descarbonizationList.push(newElement);
    }

    const topicList = [];

    for (const element of this.form.controls.formArray['controls'][4].controls['topicsFrmCtrl'].controls) {
      const newElement = {
        topic: element.value.topicCtrl,
        sub_topic: element.value.subTopicPlanCtrl,
      };
      topicList.push(newElement);
    }

    const categorization = {
      action_area_selection: actionArea,
      topics_selection: topicList,
      descarbonization_axis_selection: descarbonizationList,
      impact_categories:
        this.form.value.formArray[4].impactCategoryCtrl === '3'
          ? ['1', '2']
          : [this.form.value.formArray[4].impactCategoryCtrl],
      is_part_to_another_mitigation_action:
        this.form.value.formArray[4].descriptionRelationshipMitigationActionOthersQuestionCtrl === '1' ? true : false,
      relation_description: this.form.value.formArray[4].descriptionRelationshipMitigationActionOthersCtrl,
    };
    payload['categorization'] = categorization;
    return payload;
  }

  submitForm() {
    this.isLoading = true;

    const payload = this.buildPayload();
    if (this.isUpdating) {
      this.service
        .submitMitigationActionUpdateForm(payload, this.mitigationAction.id)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.isLoading = false;
          }),
        )
        .subscribe(
          (response) => {
            this.successSendForm(response.id);
          },
          (error) => {
            this.translateService.get('Error submitting form').subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
            log.debug(`New Mitigation Action Form error: ${error}`);

            this.errorComponent.parseErrors(error);
            this.error = error;
            this.wasSubmittedSuccessfully = false;
          },
        );
    } else {
      this.service
        .submitMitigationActionNewForm(payload)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.isLoading = false;
          }),
        )
        .subscribe(
          (response) => {
            this.successSendForm(response.id);
          },
          (error) => {
            this.translateService.get('Error submitting form').subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
            log.debug(`New Mitigation Action Form error: ${error}`);
            this.errorComponent.parseErrors(error);
            this.error = error;
            this.wasSubmittedSuccessfully = false;
          },
        );
    }
  }

  successSendForm(id: string) {
    if (this.files.initiative.files) {
      this.submitFiles(id, this.files.initiative);
    }

    if (this.files.geographic_location.files) {
      this.submitFiles(id, this.files.geographic_location);
    }

    this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.stepper.next();
    });
    this.wasSubmittedSuccessfully = true;
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

  loadUrl() {
    window.open(
      'https://docs.google.com/spreadsheets/d/17rrTYpiLsargiTnARd29HLoSOaRUYtXd/edit?usp=sharing&ouid=100093507902776240980&rtpof=true&sd=true',
    );
  }

  uploadFile(event: FileUpload) {
    const name = event.type;
    if (name === 'initiative') {
      this.files.initiative = event;
    } else if (name === 'geographic-location') {
      this.files.geographic_location = event;
    }
  }

  async submitFiles(id: string, file: FileUpload) {
    for (const f of file.files) {
      await this.service.submitFiles(id, file.type, file.files).toPromise();
    }
  }

  onStepChange() {
    this.wasSubmittedSuccessfully = false;
  }
}
