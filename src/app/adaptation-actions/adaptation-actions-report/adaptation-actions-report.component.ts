import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction, Canton, ClimateThreatCatalog, District, Province } from '../interfaces/adaptationAction';
import { ODS, SubTopics, Topic } from '../interfaces/catalogs';

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
  @Input() mainStepper: any;
  durationInSeconds = 3;
  actualProvince = 0;

  provinces: Province[] = [];
  canton: Canton[] = [];
  districts: District[] = [];
  climateThreat: ClimateThreatCatalog[] = [];

  typesTooltipTxt = [
    'Tipo A - Instrumentos de políticas y planes: acciones que plantean esquemas que buscan reducir la vulnerabilidad antes los efectos del cambio climático a través de instrumentos de política, usualmente con alcance nacional o sectorial. Pueden tener la forma de ley, política, reglamentos, planes, estrategias, entre otros. Las políticas son el conjunto de decisiones, principios y normas que orientan a la acción, definiendo objetivos y metas precisas a legitimar y ejercer el poder y la autoridad que conduzcan a satisfacer determinadas necesidades de un país, sector, etc. Los planes son un esquema general de acción que define las prioridades, los lineamientos básicos de una gestión y el alcance de las funciones, para un lapso temporal determinado.',
    'Tipo B - Proyectos y programas : Los programas son un conjunto organizado, coherente e integrado de actividades, servicios o procesos expresados en agrupaciones de proyectos que se relacionan entre sí y se desarrollan en forma simultánea o sucesiva, con los recursos necesarios y con la finalidad de alcanzar los objetivos de reducción de vulnerabilidad determinados, todo esto configurado desde un plan y con un alcance, escala y duración delimitada.',
    'Tipo C - Actividades: conjunto de operaciones o tareas enfocadas en la reducción de la vulnerabilidad que tienen alcance, escala y duración delimitada. Pueden ser parte de un proyecto, programa, de un instrumento de política, o bien, ocurrir de manera aislada.',
  ];

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
    this.loadODS();
    this.loadTopics();
    this.loadSubTopics();
    this.loadProvinces();
    this.loadClimateThreat();
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

  changeSubTopics(idTopic: string) {
    console.log('ássadd', idTopic);
    this.subTopicsToShow = this.subTopics.filter((subTopic) => subTopic.topic.id.toString() == idTopic.toString());
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
        adaptationActionGoalRelationCtrl: ['', Validators.required],
        adaptationActionEjeRelationCtrl: ['', Validators.required],
        adaptationActionLinealRelationCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        adaptationActionInstrumentCtrl: ['', [Validators.maxLength(250)]],
        adaptationActionDescriptionInstrumentCtrl: ['', [Validators.maxLength(3000)]],
      }),
      this.formBuilder.group({
        adaptationActionClimateThreatCtrl: ['', Validators.required],
        adaptationActionClimateThreatOtherCtrl: [''],
        adaptationActionInfoSourceCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        adaptationActionStartDateCtrl: ['', Validators.required],
        adaptationActionEndDateCtrl: ['', Validators.required],
        adaptationActionDurationTimeCtrl: ['', [Validators.required, Validators.maxLength(20)]],
        adaptationActionEntityCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionEntityOthersCtrl: ['', [Validators.required, Validators.maxLength(250)]],
        adaptationActionCodeCtrl: ['AA0', [Validators.required, Validators.maxLength(50)]],
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
        description: this.form.value.formArray[1].adaptationActionDescriptionNarrativeCtrl,
        GIS: this.form.value.formArray[1].adaptationActionLocationCtrl,
        district: this.form.value.formArray[1].adaptationActionDistritCtrl,
      },

      activity: {
        code: this.form.value.formArray[2].adaptationActionThemeCtrl,
        description: this.form.value.formArray[2].adaptationActionGoalRelationCtrl,
        sub_topic: parseInt(this.form.value.formArray[2].adaptationActionTypologyCtrl),
        ndc_contribution: [
          1, //parseInt(this.form.value.formArray[2].adaptationActionEjeRelationCtrl)
        ],
        adaptation_axis_guideline: 1, //parseInt(this.form.value.formArray[2].adaptationActionLinealRelationCtrl)
      },

      instrument: {
        name: this.form.value.formArray[3].adaptationActionInstrumentCtrl,
        description: this.form.value.formArray[3].adaptationActionDescriptionInstrumentCtrl,
      },

      climate_threat: {
        type_climated_threat: this.form.value.formArray[3].adaptationActionInstrumentCtrl,
      },

      implementation: {
        start_date: this.datePipe.transform(this.form.value.formArray[5].adaptationActionStartDateCtrl, 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.form.value.formArray[5].adaptationActionEndDateCtrl, 'yyyy-MM-dd'),
        duration: this.form.value.formArray[5].adaptationActionDurationTimeCtrl,
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
    // console.log(id, this.form.get('formArray').get([0]).get('adaptationActionProvinceCtrl').clearValidators());
  }
}
