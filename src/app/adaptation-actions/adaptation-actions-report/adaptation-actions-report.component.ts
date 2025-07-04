import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import {
  AdaptationAction,
  BenefitedPopulation,
  Canton,
  ClimateThreatCatalog,
  District,
  Province,
} from '../interfaces/adaptationAction';
import { AAType, Activities, ODS, SubTopics, Topic } from '../interfaces/catalogs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adaptation-actions-report',
  templateUrl: './adaptation-actions-report.component.html',
  styleUrls: ['./adaptation-actions-report.component.scss'],
  standalone: false,
})
export class AdaptationActionsReportComponent implements OnInit {
  @Output() onComplete = new EventEmitter<boolean>();

  form: UntypedFormGroup;
  topics: Topic[][] = [];
  subTopics: SubTopics[] = [];
  subTopicsToShow: SubTopics[][] = [];
  ods: ODS[];
  adaptationAction: AdaptationAction;
  benefiedPopulation: BenefitedPopulation[];
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() mainStepper: any;
  @Input() edit: boolean;
  durationInSeconds = 3;
  actualProvince = 0;

  provinces: Province[] = [];
  canton: Canton[] = [];
  districts: District[] = [];
  climateThreat: ClimateThreatCatalog[] = [];
  activities: Activities[][] = [];

  cantones: Canton[] = [];
  cantonesToShow: any[] = [];
  districtsList: District[] = [];
  cdistrictsToShow: any[] = [];

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
  @Output() onTypeSet = new EventEmitter();

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private service: AdaptationActionService,
    private translateService: TranslateService,
  ) {
    this.createForm();
  }

  async ngOnInit() {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
      if (this.adaptationAction) {
        const type = this.getType(this.adaptationAction);
        this.onTypeSet.emit(type);
      }
      if (this.isComplete()) {
        this.onComplete.emit(true);
      }
    });

    this.loadBenefitedPopulation();
    await this.loadProvinces();
    await this.loadCantones();
    await this.loadDistricts();

    this.loadODS();
    this.loadTopics();
    this.loadSubTopics();
    this.loadClimateThreat();
    this.loadAdaptationActions();
    if (this.edit) {
      this.createForm();
    }
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private getType(aa: AdaptationAction): AAType {
    const { adaptation_action_information } = aa;
    let type = adaptation_action_information?.adaptation_action_type;
    if (type && typeof type === 'object' && 'code' in type) {
      type = type.code;
    }
    return type;
  }

  setRequiredValidators() {
    // section 3
    const section3 = this.form.get('formArray').get([2]);
    const themeArray = section3.get('themeCtrl') as FormArray;
    themeArray.controls.forEach((group: AbstractControl) => {
      group.get('adaptationActionThemeCtrl').setValidators(Validators.required);
      group.get('adaptationActionTypologyCtrl').setValidators(Validators.required);
      group.get('adaptationActionTypeCtrl').setValidators(Validators.required);
      group.get('adaptationActionRelationCtrl').setValidators(Validators.required);
      group.get('adaptationActionGoalRelationCtrl').setValidators(Validators.required);
      group.get('adaptationActionEjeRelationCtrl').setValidators(Validators.required);
      group.get('adaptationActionLinealRelationCtrl').setValidators(Validators.required);
    });

    // section 4
    this.form
      .get('formArray')
      .get([3])
      .get('adaptationActionInstrumentCtrl')
      .setValidators([Validators.required, Validators.maxLength(250)]);

    // section 6
    const section6 = this.form.get('formArray').get([5]);
    section6.get('adaptationActionStartDateCtrl').setValidators([Validators.required]);
    section6.get('adaptationActionEndDateCtrl').setValidators([Validators.required]);
    section6.get('adaptationActionEntityCtrl').setValidators([Validators.required, Validators.maxLength(250)]);
    section6.get('adaptationActionEntityOthersCtrl').setValidators([Validators.required, Validators.maxLength(250)]);
    section6.get('adaptationActionCodeCtrl').setValidators([Validators.required, Validators.maxLength(50)]);
  }

  setOptionalValidators() {
    // section 3
    const section3 = this.form.get('formArray').get([2]);
    const themeArray = section3.get('themeCtrl') as FormArray;
    themeArray.controls.forEach((group: AbstractControl) => {
      group.get('adaptationActionThemeCtrl').setValidators(null);
      group.get('adaptationActionTypologyCtrl').setValidators(null);
      group.get('adaptationActionTypeCtrl').setValidators(null);
      group.get('adaptationActionRelationCtrl').setValidators(null);
      group.get('adaptationActionGoalRelationCtrl').setValidators(null);
      group.get('adaptationActionEjeRelationCtrl').setValidators(null);
      group.get('adaptationActionLinealRelationCtrl').setValidators(null);
    });

    // section 4
    this.form
      .get('formArray')
      .get([3])
      .get('adaptationActionInstrumentCtrl')
      .setValidators([Validators.maxLength(250)]);

    // section 6
    const section6 = this.form.get('formArray').get([5]);
    section6.get('adaptationActionStartDateCtrl').setValidators(null);
    section6.get('adaptationActionEndDateCtrl').setValidators(null);
    section6.get('adaptationActionEntityCtrl').setValidators([Validators.maxLength(250)]);
    section6.get('adaptationActionEntityOthersCtrl').setValidators([Validators.maxLength(250)]);
    section6.get('adaptationActionCodeCtrl').setValidators([Validators.maxLength(50)]);
  }

  updateFormValuesAndValidity() {
    // section 3
    const section3 = this.form.get('formArray').get([2]);
    const themeArray = section3.get('themeCtrl') as FormArray;
    themeArray.controls.forEach((group: AbstractControl) => {
      group.get('adaptationActionThemeCtrl').updateValueAndValidity();
      group.get('adaptationActionTypologyCtrl').updateValueAndValidity();
      group.get('adaptationActionTypeCtrl').updateValueAndValidity();
      group.get('adaptationActionRelationCtrl').updateValueAndValidity();
      group.get('adaptationActionGoalRelationCtrl').updateValueAndValidity();
      group.get('adaptationActionEjeRelationCtrl').updateValueAndValidity();
      group.get('adaptationActionLinealRelationCtrl').updateValueAndValidity();
    });

    // section 4
    const section4 = this.form.get('formArray').get([3]);
    section4.get('adaptationActionInstrumentCtrl').updateValueAndValidity();

    // section 6
    const section6 = this.form.get('formArray').get([5]);
    section6.get('adaptationActionStartDateCtrl').updateValueAndValidity();
    section6.get('adaptationActionEndDateCtrl').updateValueAndValidity();
    section6.get('adaptationActionEntityCtrl').updateValueAndValidity();
    section6.get('adaptationActionEntityOthersCtrl').updateValueAndValidity();
    section6.get('adaptationActionCodeCtrl').updateValueAndValidity();
  }

  public changeAdaptationType(id: string) {
    this.onTypeSet.emit(id);
    if (parseInt(id) === 1) {
      this.setOptionalValidators();
    } else {
      this.setRequiredValidators();
    }
    this.updateFormValuesAndValidity();
  }

  private isComplete(): boolean {
    return (
      this.adaptationAction &&
      !!this.adaptationAction.adaptation_action_information?.id &&
      !!this.adaptationAction.address?.id
    );
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
      },
    );
  }

  loadTopics(index = 0) {
    this.service.loadTopics().subscribe(
      (topics) => {
        this.topics[index] = topics;
      },
      (error) => {
        this.topics = [];
      },
    );
  }

  loadSubTopics() {
    this.service.loadSubTopics().subscribe(
      (subTopics) => {
        this.subTopics = subTopics;
      },
      (error) => {
        this.subTopics = [];
      },
    );
  }

  loadSubTopic(id: string) {
    this.service.loadSubTopics(id).subscribe(
      (subTopics) => {
        this.subTopics = subTopics;
      },
      (error) => {
        this.subTopics = [];
      },
    );
  }

  loadActivities(id: string, index: number) {
    this.service.loadActivities(id).subscribe((response) => {
      this.activities[index] = response;
    });
  }

  fillActivitiesFields(id: any, index: number) {
    const data = this.activities[index].find((x) => x.id === id);

    let adaptationActionRelationValue = '';
    let adaptationActionGoalRelationValue = '';
    const adaptationActionEjeRelationValue = data.adaptation_axis_guideline.adaptation_axis.description;
    const adaptationActionLinealRelationValue = data.adaptation_axis_guideline.description;

    for (const element of data.ndc_contribution) {
      adaptationActionRelationValue += element.ndc_area.description;
      adaptationActionGoalRelationValue += element.description;
    }

    this.form
      .get('formArray')
      .get([2])
      .get('themeCtrl')
      .get([index])
      .get('adaptationActionRelationCtrl')
      .setValue(adaptationActionRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('themeCtrl')
      .get([index])
      .get('adaptationActionGoalRelationCtrl')
      .setValue(adaptationActionGoalRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('themeCtrl')
      .get([index])
      .get('adaptationActionEjeRelationCtrl')
      .setValue(adaptationActionEjeRelationValue);
    this.form
      .get('formArray')
      .get([2])
      .get('themeCtrl')
      .get([index])
      .get('adaptationActionLinealRelationCtrl')
      .setValue(adaptationActionLinealRelationValue);

    this.form.get('formArray').get([2]).get('themeCtrl').get([index]).get('adaptationActionRelationCtrl').disable();
    this.form.get('formArray').get([2]).get('themeCtrl').get([index]).get('adaptationActionGoalRelationCtrl').disable();
    this.form.get('formArray').get([2]).get('themeCtrl').get([index]).get('adaptationActionEjeRelationCtrl').disable();
    this.form
      .get('formArray')
      .get([2])
      .get('themeCtrl')
      .get([index])
      .get('adaptationActionLinealRelationCtrl')
      .disable();
  }

  changeSubTopics(idTopic: string, index: number) {
    this.service.loadSubTopics(idTopic).subscribe(
      (subTopics) => {
        this.subTopicsToShow[index] = subTopics;
      },
      (error) => {
        this.subTopics = [];
      },
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
        expectedResultsCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        beneficiaryPopulationCtrl: ['', [Validators.required]],
        potentialCoBenefitsCtrl: ['', [Validators.required, Validators.maxLength(500)]],
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
        themeCtrl: this.formBuilder.array([this.createThemesCtrl()]),
      }),
      this.formBuilder.group({
        adaptationActionInstrumentCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionClimateThreatCtrl: ['', Validators.required],
        adaptationActionClimateThreatOtherCtrl: [''],
        adaptationActionInfoSourceCtrl: ['', Validators.required],
        descriptionVulnerabilityCtrl: ['', [Validators.required, Validators.maxLength(1000)]],
        descriptionElementsExposedCtrl: ['', [Validators.required, Validators.maxLength(1000)]],
        descriptionLossesDamagesCtrl: ['', [Validators.required, Validators.maxLength(500)]],
        descriptionClimateRelatedRisksCtrl: ['', [Validators.required, Validators.maxLength(500)]],
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

  createThemesCtrl(activities: any = null) {
    if (activities) {
      const list: any[] = [];
      let index = 0;
      for (const element of activities) {
        this.loadTopics(index);
        this.changeSubTopics(element?.sub_topic?.topic?.id, index);
        this.loadActivities(element?.sub_topic?.id, index);

        let adaptationActionRelationValue = '';
        let adaptationActionGoalRelationValue = '';
        const adaptationActionEjeRelationValue = element.adaptation_axis_guideline.adaptation_axis.description;
        const adaptationActionLinealRelationValue = element.adaptation_axis_guideline.description;

        for (const option of element.ndc_contribution) {
          adaptationActionRelationValue += option.ndc_area.description;
          adaptationActionGoalRelationValue += option.description;
        }

        list.push(
          this.formBuilder.group({
            adaptationActionThemeCtrl: [element?.sub_topic?.topic?.id, Validators.required],
            adaptationActionTypologyCtrl: [element?.sub_topic?.id, Validators.required],
            adaptationActionTypeCtrl: [element?.id, Validators.required],
            adaptationActionRelationCtrl: [adaptationActionRelationValue, Validators.required],
            adaptationActionGoalRelationCtrl: [adaptationActionGoalRelationValue, Validators.required],
            adaptationActionEjeRelationCtrl: [adaptationActionEjeRelationValue, Validators.required],
            adaptationActionLinealRelationCtrl: [adaptationActionLinealRelationValue, Validators.required],
          }),
        );
        index = +1;
      }
      return this.formBuilder.array(list);
    } else {
      return this.formBuilder.group({
        adaptationActionThemeCtrl: ['', Validators.required],
        adaptationActionTypologyCtrl: ['', Validators.required],
        adaptationActionTypeCtrl: ['', Validators.required],
        adaptationActionRelationCtrl: ['', Validators.required],
        adaptationActionGoalRelationCtrl: ['', Validators.required],
        adaptationActionEjeRelationCtrl: ['', Validators.required],
        adaptationActionLinealRelationCtrl: ['', Validators.required],
      });
    }
  }

  removeThemeCtrl(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][2].controls['themeCtrl'];
    control.removeAt(index);
  }

  addThemeCtrl(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][2].controls['themeCtrl'].controls;
    control.push(this.createThemesCtrl());
    this.loadTopics(index);
  }

  loadBenefitedPopulation() {
    this.service.loadBenefitedPopulation().subscribe(
      (response) => (this.benefiedPopulation = response),
      (error) => {
        this.benefiedPopulation = [];
      },
    );
  }

  loadProvinceSByCantonSelected(cantons: Canton[]) {
    const provinceList: Province[] = [];

    for (const canton of cantons) {
      const isInProvinceList = provinceList.find((x) => x.id === canton.province.id);
      if (!isInProvinceList) {
        provinceList.push(canton.province);
      }
    }
    return provinceList;
  }

  loadCantonByDistrictSelected(districts: District[]) {
    const cantonList: Canton[] = [];
    for (const district of districts) {
      const isCantonInList = cantonList.find((x) => x.id === district.canton.id);
      if (!isCantonInList) {
        cantonList.push(district.canton);
      }
    }

    return cantonList;
  }

  buildUpdatedRegisterForm() {
    let provinceList: Province[] = [];
    let cantonList: Canton[] = [];
    let districtList: District[] = [];

    const adaptationActionStartDate = new Date(this.adaptationActionUpdated.implementation.start_date);
    const adaptationActionEndDate = new Date(this.adaptationActionUpdated.implementation.end_date);

    adaptationActionStartDate.setMinutes(
      adaptationActionStartDate.getMinutes() + adaptationActionStartDate.getTimezoneOffset(),
    );

    adaptationActionEndDate.setMinutes(
      adaptationActionEndDate.getMinutes() + adaptationActionEndDate.getTimezoneOffset(),
    );

    if (this.adaptationActionUpdated.address.app_scale === '2') {
      provinceList = this.loadProvinceSByCantonSelected(this.adaptationActionUpdated.address.canton);
      cantonList = this.adaptationActionUpdated.address.canton;
      this.selectProvince(provinceList.map((x) => x.id.toString()));
      this.selectCanton(cantonList.map((x) => x.id.toString()));
    }

    if (this.adaptationActionUpdated.address.app_scale === '3') {
      cantonList = this.loadCantonByDistrictSelected(this.adaptationActionUpdated.address.district);
      provinceList = this.loadProvinceSByCantonSelected(cantonList);
      districtList = this.adaptationActionUpdated.address.district;
      this.selectProvince(provinceList.map((x) => x.id.toString()));
      this.selectCanton(cantonList.map((x) => x.id.toString()));
    }

    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionTypeCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.adaptation_action_type
            ? this.adaptationActionUpdated.adaptation_action_information.adaptation_action_type.id.toString()
            : '',
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
        expectedResultsCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.expected_result,
          [Validators.required, Validators.maxLength(500)],
        ],
        beneficiaryPopulationCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.benefited_population.map((x: { id: any }) => x.id),
          [Validators.required],
        ],
        potentialCoBenefitsCtrl: [
          this.adaptationActionUpdated.adaptation_action_information.potential_co_benefits,
          [Validators.required, Validators.maxLength(500)],
        ],
      }),
      this.formBuilder.group({
        appScaleCtrl: [parseInt(this.adaptationActionUpdated.address.app_scale), Validators.required],
        adaptationActionProvinceCtrl: [
          this.adaptationActionUpdated.address.app_scale === '2' ||
          this.adaptationActionUpdated.address.app_scale === '3'
            ? provinceList.map((x) => x.id) // ? this.adaptationActionUpdated.address.district[0].canton.province.id
            : [],
        ],
        adaptationActionCantonCtrl: [
          this.adaptationActionUpdated.address.app_scale === '2' ||
          this.adaptationActionUpdated.address.app_scale === '3'
            ? cantonList.map((x) => x.id) // ? this.adaptationActionUpdated.address.district[0].canton.province.id
            : [], //? this.adaptationActionUpdated.address.district[0].canton.id
        ],
        adaptationActionDistritCtrl: [
          this.adaptationActionUpdated.address.app_scale === '3'
            ? districtList.map((x) => x.id) // ? this.adaptationActionUpdated.address.district[0].id
            : [],
        ],
        adaptationActionDescriptionNarrativeCtrl: [
          this.adaptationActionUpdated.address.description,
          [Validators.required, Validators.maxLength(3000)],
        ],
        adaptationActionLocationCtrl: [this.adaptationActionUpdated.address.GIS],
        adaptationActionLocationOtherCtrl: [''],
      }),
      this.formBuilder.group({
        themeCtrl: this.createThemesCtrl(this.adaptationActionUpdated?.activity),
      }),
      this.formBuilder.group({
        adaptationActionInstrumentCtrl: [this.adaptationActionUpdated.instrument.name],
      }),
      this.formBuilder.group({
        adaptationActionClimateThreatCtrl: [
          this.adaptationActionUpdated.climate_threat.type_climate_threat.map((x: { id: any }) => x.id),
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
        ],
        descriptionElementsExposedCtrl: [
          this.adaptationActionUpdated.climate_threat.exposed_elements,
          [Validators.required, Validators.maxLength(1000)],
        ],
        descriptionLossesDamagesCtrl: [
          this.adaptationActionUpdated.climate_threat.description_losses,
          [Validators.required, Validators.maxLength(500)],
        ],
        descriptionClimateRelatedRisksCtrl: [
          this.adaptationActionUpdated.climate_threat.description_risks,
          [Validators.required, Validators.maxLength(500)],
        ],
      }),
      this.formBuilder.group({
        adaptationActionStartDateCtrl: [adaptationActionStartDate, Validators.required],
        adaptationActionEndDateCtrl: [adaptationActionEndDate, Validators.required],
        adaptationActionEntityCtrl: [
          this.adaptationActionUpdated.implementation.responsible_entity,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionEntityOthersCtrl: [
          this.adaptationActionUpdated.implementation.other_entity,
          [Validators.required, Validators.maxLength(250)],
        ],
        adaptationActionCodeCtrl: [
          this.adaptationActionUpdated.implementation.action_code
            ? this.adaptationActionUpdated.implementation.action_code
            : 'AA0',
          [Validators.required, Validators.maxLength(50)],
        ],
      }),
    ]);
  }

  submitForm() {
    const payload: AdaptationAction = this.buildPayload();

    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
      (res) => {
        this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
        let type = this.getType(res.body);
        this.onTypeSet.emit(type);
        this.onComplete.emit(true);
        this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
          this.mainStepper.next();
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      },
    );
  }

  buildPayload() {
    const context = {
      adaptation_action_information: {
        name: this.form.value.formArray[0].adaptationActionNameCtrl,
        objective: this.form.value.formArray[0].adaptationActionTargetCtrl,
        description: this.form.value.formArray[0].adaptationActionDescriptionCtrl,
        meta: this.form.value.formArray[0].adaptationActionGoalCtrl,
        adaptation_action_type: Number(this.form.value.formArray[0].adaptationActionTypeCtrl),
        ods: this.form.value.formArray[0].adaptationActionODSCtrl,
        expected_result: this.form.value.formArray[0].expectedResultsCtrl,
        potential_co_benefits: this.form.value.formArray[0].potentialCoBenefitsCtrl,
        benefited_population: this.form.value.formArray[0].beneficiaryPopulationCtrl,
      },
      address: {
        app_scale: this.form.value.formArray[1].appScaleCtrl,
        description: this.form.value.formArray[1].adaptationActionDescriptionNarrativeCtrl,
        GIS: this.form.value.formArray[1].adaptationActionLocationCtrl
          ? this.form.value.formArray[1].adaptationActionLocationCtrl
          : null,
        district: this.form.value.formArray[1].adaptationActionDistritCtrl
          ? this.form.value.formArray[1].adaptationActionDistritCtrl
          : [],
        canton:
          this.form.value.formArray[1].appScaleCtrl === 2
            ? this.form.value.formArray[1].adaptationActionCantonCtrl
            : [],
      },

      activity: this.form.controls.formArray['controls'][2].controls['themeCtrl'].controls.map(
        (x: { value: { adaptationActionTypeCtrl: number } }) => x.value.adaptationActionTypeCtrl,
      ),

      instrument: {
        name: this.form.value.formArray[3].adaptationActionInstrumentCtrl,
      },

      climate_threat: {
        type_climate_threat: this.form.value.formArray[4].adaptationActionClimateThreatCtrl,
        other_type_climate_threat: this.form.value.formArray[4].adaptationActionClimateThreatOtherCtrl
          ? this.form.value.formArray[4].adaptationActionClimateThreatOtherCtrl
          : null,
        description_climate_threat: this.form.value.formArray[4].adaptationActionInfoSourceCtrl,
        vulnerability_climate_threat: this.form.value.formArray[4].descriptionVulnerabilityCtrl,
        exposed_elements: this.form.value.formArray[4].descriptionElementsExposedCtrl,
        description_losses: this.form.value.formArray[4].descriptionLossesDamagesCtrl,
        description_risks: this.form.value.formArray[4].descriptionClimateRelatedRisksCtrl,
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

  selectProvince(ids: string[]) {
    const cantonListGroup = [];
    for (const provinceId of ids) {
      const province = this.provinces.find((x) => x.id === parseInt(provinceId));
      const filterCantones = this.cantones.filter((x) => x.province.id === province.id);
      const element = {
        provinceName: province.name,
        provinceID: province.id,
        provinceCode: province.code,
        cantones: filterCantones,
      };

      cantonListGroup.push(element);
    }

    this.cantonesToShow = cantonListGroup;

    //this.actualProvince = parseInt(id);
    //this.loadCanton(parseInt(id));
  }

  public selectCanton(ids: string[]) {
    const districListGroup = [];
    for (const cantonID of ids) {
      const canton = this.cantones.find((x) => x.id === parseInt(cantonID));
      const filterDistrict = this.districtsList.filter((x) => x.canton.id === canton.id);
      const element = {
        cantonName: canton.name,
        cantonID: canton.id,
        cantonCode: canton.code,
        districts: filterDistrict,
      };

      districListGroup.push(element);
    }
    this.cdistrictsToShow = districListGroup;
    // this.loadDistrict(parseInt(id));
  }

  public async loadProvinces() {
    const provinces = await this.service.loadProvince().toPromise();
    this.provinces = provinces;
  }

  public loadCanton(provinceID: number) {
    this.service.loadCanton(provinceID).subscribe((response) => {
      this.canton = response;
    });
  }

  public async loadCantones() {
    const cantones = await this.service.loadCantones().toPromise();
    this.cantones = cantones;
  }

  public async loadDistricts() {
    const districts = await this.service.loadDistricts().toPromise();
    this.districtsList = districts;
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
      if (id == 2) {
        this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').setValidators(Validators.required);
        this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').setValidators(Validators.required);
        this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').setValidators(null);
      } else {
        this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').setValidators(Validators.required);
        this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').setValidators(Validators.required);
        this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').setValidators(Validators.required);
      }
    }
    this.form.get('formArray').get([1]).get('adaptationActionProvinceCtrl').updateValueAndValidity();
    this.form.get('formArray').get([1]).get('adaptationActionCantonCtrl').updateValueAndValidity();
    this.form.get('formArray').get([1]).get('adaptationActionDistritCtrl').updateValueAndValidity();
  }
}
