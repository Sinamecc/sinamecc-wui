import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction, Canton, ClimateThreatCatalog, District, Province } from '../interfaces/adaptationAction';
import { Activities, ODS, SubTopics, Topic } from '../interfaces/catalogs';

@Component({
  selector: 'app-adaptation-actions-report',
  templateUrl: './adaptation-actions-report.component.html',
  styleUrls: ['./adaptation-actions-report.component.scss'],
})
export class AdaptationActionsReportComponent implements OnInit {
  form: FormGroup;
  topics: Topic[] = [];
  subTopics: SubTopics[] = [];
  subTopicsToShow: SubTopics[] = [];
  ods: ODS[];
  adaptationAction: AdaptationAction;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() mainStepper: any;
  @Input() edit: boolean;
  durationInSeconds = 3;
  actualProvince = 0;

  provinces: Province[] = [];
  canton: Canton[] = [];
  districts: District[] = [];
  climateThreat: ClimateThreatCatalog[] = [];
  activities: Activities[];

  adaptationActionMap = {
    '1': 'A',
    '2': 'B',
    '3': 'C',
  };

  typesTooltipTxt = [
    'Tipo A - Instrumentos de políticas y planes: acciones que plantean esquemas que buscan reducir la vulnerabilidad antes los efectos del cambio climático a través de instrumentos de política, usualmente con alcance nacional o sectorial. Pueden tener la forma de ley, política, reglamentos, planes, estrategias, entre otros. Las políticas son el conjunto de decisiones, principios y normas que orientan a la acción, definiendo objetivos y metas precisas a legitimar y ejercer el poder y la autoridad que conduzcan a satisfacer determinadas necesidades de un país, sector, etc. Los planes son un esquema general de acción que define las prioridades, los lineamientos básicos de una gestión y el alcance de las funciones, para un lapso temporal determinado.',
    'Tipo B - Proyectos y programas : Los programas son un conjunto organizado, coherente e integrado de actividades, servicios o procesos expresados en agrupaciones de proyectos que se relacionan entre sí y se desarrollan en forma simultánea o sucesiva, con los recursos necesarios y con la finalidad de alcanzar los objetivos de reducción de vulnerabilidad determinados, todo esto configurado desde un plan y con un alcance, escala y duración delimitada.',
    'Tipo C - Actividades: conjunto de operaciones o tareas enfocadas en la reducción de la vulnerabilidad que tienen alcance, escala y duración delimitada. Pueden ser parte de un proyecto, programa, de un instrumento de política, o bien, ocurrir de manera aislada.',
  ];

  adaptationActions = 0;
  adaptationActionsExtension = '';

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private service: AdaptationActionService
  ) {}

  ngOnInit() {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
    });

    this.loadODS();
    this.loadTopics();
    this.loadSubTopics();
    this.loadProvinces();
    this.loadClimateThreat();
    this.loadAdaptationActions();
    this.createForm();

    //this.createForm();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: !this.edit ? this.buildRegisterForm() : this.buildUpdatedRegisterForm(),
    });
  }

  loadAdaptationActions() {
    this.service.loadAdaptationActions().subscribe((response) => {
      this.adaptationActions = response.length;
      this.adaptationActionsExtension = '';
      const charLength = this.adaptationActionsExtension.toString().length;
      new Array(4 - charLength).fill(0).forEach((_) => {
        this.adaptationActionsExtension += '0';
      });
      this.adaptationActionsExtension += this.adaptationActions;
    });
  }

  loadODS() {
    this.service.loadODS().subscribe(
      (ods) => {
        this.ods = ods;
      },
      (error) => {
        this.ods = [];
      }
    );
  }

  loadTopics() {
    this.service.loadTopics().subscribe(
      (topics) => {
        this.topics = topics;
      },
      (error) => {
        this.topics = [];
      }
    );
  }

  loadSubTopics() {
    this.service.loadSubTopics().subscribe(
      (subTopics) => {
        this.subTopics = subTopics;
      },
      (error) => {
        this.subTopics = [];
      }
    );
  }

  loadSubTopic(id: string) {
    this.service.loadSubTopics(id).subscribe(
      (subTopics) => {
        this.subTopics = subTopics;
      },
      (error) => {
        this.subTopics = [];
      }
    );
  }

  loadActivities(id: string) {
    this.service.loadActivities(id).subscribe((response) => {
      this.activities = response;
    });
  }

  fillActivitiesFields(id: any) {
    const data = this.activities.find((x) => x.id === id);

    let adaptationActionRelationValue = '';
    let adaptationActionGoalRelationValue = '';
    const adaptationActionEjeRelationValue = data.adaptation_axis_guideline.adaptation_axis.description;
    const adaptationActionLinealRelationValue = data.adaptation_axis_guideline.description;

    for (const element of data.ndc_contribution) {
      adaptationActionRelationValue += element.ndc_area.description;
      adaptationActionGoalRelationValue += element.description;
    }

    this.form.get('formArray').get([2]).get('adaptationActionRelationCtrl').setValue(adaptationActionRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('adaptationActionGoalRelationCtrl')
      .setValue(adaptationActionGoalRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('adaptationActionEjeRelationCtrl')
      .setValue(adaptationActionEjeRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('adaptationActionLinealRelationCtrl')
      .setValue(adaptationActionLinealRelationValue);

    this.form.get('formArray').get([2]).get('adaptationActionRelationCtrl').disable();
    this.form.get('formArray').get([2]).get('adaptationActionGoalRelationCtrl').disable();
    this.form.get('formArray').get([2]).get('adaptationActionEjeRelationCtrl').disable();
    this.form.get('formArray').get([2]).get('adaptationActionLinealRelationCtrl').disable();
  }

  changeSubTopics(idTopic: string) {
    this.service.loadSubTopics(idTopic).subscribe(
      (subTopics) => {
        this.subTopicsToShow = subTopics;
      },
      (error) => {
        this.subTopics = [];
      }
    );
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionTypeCtrl: ['', Validators.required],
        adaptationActionNameCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionTargetCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
        adaptationActionDescriptionCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
        adaptationActionGoalCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
        adaptationActionODSCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        appScaleCtrl: ['', Validators.required],
        adaptationActionProvinceCtrl: [''],
        adaptationActionCantonCtrl: [''],
        adaptationActionDistritCtrl: [''],
        adaptationActionDescriptionNarrativeCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
        adaptationActionLocationCtrl: [''],
        adaptationActionLocationOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionThemeCtrl: ['', Validators.required],
        adaptationActionTypologyCtrl: ['', Validators.required],
        adaptationActionTypeCtrl: ['', Validators.required], // new field
        adaptationActionRelationCtrl: ['', Validators.required],
        adaptationActionGoalRelationCtrl: ['', Validators.required],
        adaptationActionEjeRelationCtrl: ['', Validators.required],
        adaptationActionLinealRelationCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        adaptationActionInstrumentCtrl: [''],
        adaptationActionDescriptionInstrumentCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionClimateThreatCtrl: ['', Validators.required],
        adaptationActionClimateThreatOtherCtrl: [''],
        adaptationActionInfoSourceCtrl: ['', Validators.required],
        descriptionVulnerabilityCtrl: ['', [Validators.required, Validators.maxLength(1000)]], // new field
        descriptionElementsExposedCtrl: ['', [Validators.required, Validators.maxLength(1000)]], // new field
      }),
      this.formBuilder.group({
        adaptationActionStartDateCtrl: ['', Validators.required],
        adaptationActionEndDateCtrl: ['', Validators.required],
        adaptationActionEntityCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionEntityOthersCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionCodeCtrl: ['AA0', [Validators.required, Validators.maxLength(50)]],
      }),
    ]);
  }

  buildUpdatedRegisterForm() {
    this.selectProvince(this.adaptationActionUpdated.address.district.canton.province.id);
    this.selectCanton(this.adaptationActionUpdated.address.district.canton.id);
    this.changeSubTopics(this.adaptationActionUpdated?.activity?.sub_topic?.topic?.id);
    this.loadActivities(this.adaptationActionUpdated?.activity?.sub_topic?.id);

    const data = this.adaptationActionUpdated?.activity;

    let adaptationActionRelationValue = '';
    let adaptationActionGoalRelationValue = '';
    const adaptationActionEjeRelationValue = data.adaptation_axis_guideline.adaptation_axis.description;
    const adaptationActionLinealRelationValue = data.adaptation_axis_guideline.description;

    for (const element of data.ndc_contribution) {
      adaptationActionRelationValue += element.ndc_area.description;
      adaptationActionGoalRelationValue += element.description;
    }

    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionTypeCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.adaptation_action_type.id.toString(),
          Validators.required,
        ],
        adaptationActionNameCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.name,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionTargetCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.objective,
          [Validators.required, Validators.maxLength(3000)],
        ],
        adaptationActionDescriptionCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.description,
          [Validators.required, Validators.maxLength(3000)],
        ],
        adaptationActionGoalCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.meta,
          [Validators.required, Validators.maxLength(3000)],
        ],
        adaptationActionODSCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.ods.map((x: any) => x.code),
          Validators.required,
        ],
      }),
      this.formBuilder.group({
        appScaleCtrl: [parseInt(this.adaptationActionUpdated.address.app_scale), Validators.required],
        adaptationActionProvinceCtrl: [this.adaptationActionUpdated.address.district.canton.province.id],
        adaptationActionCantonCtrl: [this.adaptationActionUpdated.address.district.canton.id],
        adaptationActionDistritCtrl: [this.adaptationActionUpdated.address.district.id],
        adaptationActionDescriptionNarrativeCtrl: [
          this.adaptationActionUpdated.address.description,
          [Validators.required, Validators.maxLength(3000)],
        ],
        adaptationActionLocationCtrl: [this.adaptationActionUpdated.address.GIS],
        adaptationActionLocationOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionThemeCtrl: [this.adaptationActionUpdated?.activity?.sub_topic?.topic?.id, Validators.required],
        adaptationActionTypologyCtrl: [this.adaptationActionUpdated?.activity?.sub_topic?.id, Validators.required],
        adaptationActionTypeCtrl: [this.adaptationActionUpdated?.activity?.id, Validators.required], // new field
        adaptationActionRelationCtrl: [adaptationActionRelationValue, Validators.required],
        adaptationActionGoalRelationCtrl: [adaptationActionGoalRelationValue, Validators.required],
        adaptationActionEjeRelationCtrl: [adaptationActionEjeRelationValue, Validators.required],
        adaptationActionLinealRelationCtrl: [adaptationActionLinealRelationValue, Validators.required],
      }),
      this.formBuilder.group({
        adaptationActionInstrumentCtrl: [this.adaptationActionUpdated.instrument.name],
        adaptationActionDescriptionInstrumentCtrl: [this.adaptationActionUpdated.instrument.description],
      }),
      this.formBuilder.group({
        adaptationActionClimateThreatCtrl: [
          this.adaptationActionUpdated.climate_threat.type_climated_threat,
          Validators.required,
        ],
        adaptationActionClimateThreatOtherCtrl: [this.adaptationActionUpdated.climate_threat.other_type_climate_threat],
        adaptationActionInfoSourceCtrl: [
          this.adaptationActionUpdated.climate_threat.description_climate_threat,
          Validators.required,
        ],
        descriptionVulnerabilityCtrl: [
          this.adaptationActionUpdated.climate_threat.vulnerability_climate_threat,
          [Validators.required, Validators.maxLength(1000)],
        ], // new field
        descriptionElementsExposedCtrl: [
          this.adaptationActionUpdated.climate_threat.exposed_elements,
          [Validators.required, Validators.maxLength(1000)],
        ], // new field
      }),
      this.formBuilder.group({
        adaptationActionStartDateCtrl: [this.adaptationActionUpdated.implementation.start_date, Validators.required],
        adaptationActionEndDateCtrl: [this.adaptationActionUpdated.implementation.end_date, Validators.required],
        adaptationActionEntityCtrl: [
          this.adaptationActionUpdated.implementation.responsible_entity,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionEntityOthersCtrl: [
          this.adaptationActionUpdated.implementation.other_entity,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionCodeCtrl: [
          this.adaptationActionUpdated.implementation.action_code,
          [Validators.required, Validators.maxLength(50)],
        ],
      }),
    ]);
  }

  submitForm() {
    const payload: AdaptationAction = this.buildPayload();
    this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
    this.mainStepper.next();
  }

  buildPayload() {
    const context = {
      adaptation_action_information: {
        name: this.form.value.formArray[0].adaptationActionNameCtrl,
        objective: this.form.value.formArray[0].adaptationActionTargetCtrl,
        description: this.form.value.formArray[0].adaptationActionDescriptionCtrl,
        meta: this.form.value.formArray[0].adaptationActionGoalCtrl,
        adaptation_action_type: this.form.value.formArray[0].adaptationActionTypeCtrl,
        ods: this.form.value.formArray[0].adaptationActionODSCtrl,
      },
      address: {
        app_scale: this.form.value.formArray[1].appScaleCtrl,
        description: this.form.value.formArray[1].adaptationActionDescriptionNarrativeCtrl,
        GIS: this.form.value.formArray[1].adaptationActionLocationCtrl,
        district: this.form.value.formArray[1].adaptationActionDistritCtrl
          ? this.form.value.formArray[1].adaptationActionDistritCtrl
          : null,
      },

      activity: this.form.value.formArray[2].adaptationActionTypeCtrl,

      instrument: {
        name: this.form.value.formArray[3].adaptationActionInstrumentCtrl,
        description: this.form.value.formArray[3].adaptationActionDescriptionInstrumentCtrl,
      },

      climate_threat: {
        type_climated_threat: this.form.value.formArray[4].adaptationActionClimateThreatCtrl,
        other_type_climate_threat: this.form.value.formArray[4].adaptationActionClimateThreatOtherCtrl
          ? this.form.value.formArray[4].adaptationActionClimateThreatOtherCtrl
          : null,
        description_climate_threat: this.form.value.formArray[4].adaptationActionInfoSourceCtrl,
        vulnerability_climate_threat: this.form.value.formArray[4].descriptionVulnerabilityCtrl,
        exposed_elements: this.form.value.formArray[4].descriptionElementsExposedCtrl,
      },

      implementation: {
        start_date: this.datePipe.transform(this.form.value.formArray[5].adaptationActionStartDateCtrl, 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.form.value.formArray[5].adaptationActionEndDateCtrl, 'yyyy-MM-dd'),
        responsible_entity: this.form.value.formArray[5].adaptationActionEntityCtrl,
        other_entity: this.form.value.formArray[5].adaptationActionEntityOthersCtrl,
        action_code: this.form.value.formArray[5].adaptationActionCodeCtrl,
      },
    };
    return context;
  }

  public goToLink(url: string) {
    window.open(url, '_blank');
  }

  selectProvince(id: string) {
    this.actualProvince = parseInt(id);
    this.loadCanton(parseInt(id));
  }

  public selectCanton(id: string) {
    this.loadDistrict(parseInt(id));
  }

  public loadProvinces() {
    this.service.loadProvince().subscribe((response) => {
      this.provinces = response;
    });
  }

  public loadCanton(provinceID: number) {
    this.service.loadCanton(provinceID).subscribe((response) => {
      this.canton = response;
    });
  }

  public loadDistrict(cantonID: number) {
    this.service.loadDistrict(cantonID, this.actualProvince).subscribe((response) => {
      this.districts = response;
    });
  }

  public loadClimateThreat() {
    this.service.loadClimateThreat().subscribe((response) => {
      this.climateThreat = response;
    });
  }

  public changeLocationValidations(id: number) {
    if (id === 1) {
      this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').setValidators(null);
      this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').setValidators(null);
      this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').setValidators(null);
    } else {
      this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').setValidators(Validators.required);
      this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').setValidators(Validators.required);
      this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').setValidators(Validators.required);
    }
    this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').updateValueAndValidity();
    this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').updateValueAndValidity();
    this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').updateValueAndValidity();
  }

  public changeAdaptationType(id: string) {
    if (parseInt(id) === 1) {
      this.form
        .get('formArray')
        .get([3])
        .get('adaptationActionDescriptionInstrumentCtrl')
        .setValidators([Validators.maxLength(3000)]);
      this.form
        .get('formArray')
        .get([3])
        .get('adaptationActionInstrumentCtrl')
        .setValidators([Validators.maxLength(250)]);
    } else {
      this.form
        .get('formArray')
        .get([3])
        .get('adaptationActionDescriptionInstrumentCtrl')
        .setValidators([Validators.required, Validators.maxLength(3000)]);
      this.form
        .get('formArray')
        .get([3])
        .get('adaptationActionInstrumentCtrl')
        .setValidators([Validators.required, Validators.maxLength(250)]);
    }

    this.form.get('formArray').get([3]).get('adaptationActionDescriptionInstrumentCtrl').updateValueAndValidity();
    this.form.get('formArray').get([3]).get('adaptationActionInstrumentCtrl').updateValueAndValidity();
  }
}
