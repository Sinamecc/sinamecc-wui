import { CommentsStructure } from '@app/@shared/comment';

export const commentsStructureModule1: CommentsStructure[] = [
  {
    module: 'Registro de datos',
    fields: [
      'adaptationAction.form1.reportingEntityType',
      'adaptationAction.form1.responsibleReportingEntity',
      'adaptationAction.form1.legalID',
      'adaptationAction.form1.reportData',
      'ppcn.nameContactPerson',
      'adaptationAction.form1.entityAddress',
    ],
  },
];

export const commentsStructureModule2: CommentsStructure[] = [
  {
    module: 'adaptationAction.form2.registerInfo',
    fields: [
      'adaptationAction.form2.AAType',
      'adaptationAction.form2.AAName',
      'adaptationAction.form2.AAObjective',
      'adaptationAction.form2.AADescription',
      'adaptationAction.form2.AAGoal',
      'Identificación preliminar de los Objetivos de Desarrollo Sostenible (ODS) impactados',
    ],
  },
  {
    module: 'general.GeographicLocation',
    fields: [
      'adaptationAction.form2.appScale',
      'adaptationAction.form2.AAProvince',
      'adaptationAction.form2.AACanton',
      'adaptationAction.form2.AADistrict',
      'adaptationAction.form2.narrativeActionPlace',
      'adaptationAction.form2.attachGeographicalLocation',
    ],
  },
  {
    module: 'adaptationAction.form2.categorizationNationalIntruments',
    fields: [
      'adaptationAction.form2.selectTopic',
      'adaptationAction.form2.selectSubtopic',
      'adaptationAction.form2.relationNDC',
      'adaptationAction.form2.relationshipAxis',
      'adaptationAction.form2.relationshipGuideline',
    ],
  },
  {
    module: 'adaptationAction.form2.relationshipInstruments',
    fields: ['adaptationAction.form2.namePlanningInstrument', 'adaptationAction.form2.adaptationIntegrated'],
  },
  {
    module: 'adaptationAction.form2.climateRelatedHazard',
    fields: [
      'daptationAction.form2.relatedClimateThreat',
      'adaptationAction.form2.relatedClimateThreatOther',
      'adaptationAction.form2.descriptionRelatedClimateThreat',
    ],
  },
  {
    module: 'adaptationAction.form2.implementation',
    fields: [
      'adaptationAction.form2.startImplementation',
      'adaptationAction.form2.endImplementation',
      'adaptationAction.form2.durationAction',
      'adaptationAction.form2.responsibleExecuting',
      'adaptationAction.form2.otherEntitiesInvolved',
      'adaptationAction.form2.actionCode',
    ],
  },
];

export const commentsStructureModule3: CommentsStructure[] = [
  {
    module: 'adaptationAction.form3.financingInfo',
    fields: [
      'adaptationAction.form3.status',
      'adaptationAction.form3.stepsFinancing',
      'adaptationAction.form3.sourceFinancing',
      'adaptationAction.form3.financingInstrument',
      'Presupuesto',
      'adaptationAction.form3.actionsfinancedInternationalSources',
    ],
  },
  {
    module: 'adaptationAction.form3.financingInfo',
    fields: [
      'adaptationAction.form3.mideplanRegistes',
      'adaptationAction.form3.projectNameRegistered',
      ' adaptationAction.form3.executingEntity',
      '',
    ],
  },
];

export const commentsStructureModule4: CommentsStructure[] = [
  {
    module: 'adaptationAction.form4.RegisterIindicators',
    fields: [
      'adaptationAction.form4.indicatorName',
      'adaptationAction.form4.indicatorDescription',
      'mitigationAction.indicatorUnit',
      'adaptationAction.form4.calculationMethodology',
      'mitigationAction.indicatorReportingPeriodicity',
      'mitigationAction.timeSeriesAvailable',
      'mitigationAction.geographicCoverage',
      'mitigationAction.disintegration',
      'mitigationAction.dataSource',
      'mitigationAction.howSustainabilityIndicator',
      'mitigationAction.observationsComments',
    ],
  },
  {
    module: 'mitigationAction.indicatorDataSource',
    fields: [
      'mitigationAction.responsibleInstitution',
      'adaptationAction.form4.sourceType',
      'adaptationAction.form4.sourceTypeDetail',
      'mitigationAction.statisticalOperationName',
    ],
  },
  {
    module: 'reportData.thematicCategorization',
    fields: [
      'mitigationAction.datatypeDetail',
      'mitigationAction.SINAMECCClassifiers',
      'mitigationAction.SINAMECCClassifiers',
    ],
  },
];

export const commentsStructureModule5: CommentsStructure[] = [
  {
    module: 'mitigationAction.monitoringProgressLog',
    fields: ['adaptationAction.form4.statusReportingPeriod', 'adaptationAction.form4.progressMonitoringClimateAction'],
  },
  {
    module: 'mitigationAction.indicatorMonitoring',
    fields: [
      'adaptationAction.form5.selectIndicador',
      'mitigationAction.reportingPeriod',
      'mitigationAction.indicatorDataUpdateDate',
      'adaptationAction.form4.indicatorVerificationSource',
      'adaptationAction.form4.attachSupportMonitoring',
    ],
  },
  {
    module: 'mitigationAction.generalProgressReportClimateAction',
    fields: ['Desde', 'general.until', 'adaptationAction.form4.descriptiveWay'],
  },
];

export const commentsStructureModule6: CommentsStructure[] = [
  {
    module: 'adaptationAction.form6.actionImpact',
    fields: [
      'adaptationAction.form6.temporalityImpact',
      'adaptationAction.form6.impactsAction',
      'adaptationAction.form6.impactsAction',
      'adaptationAction.form6.genderEquity',
      'adaptationAction.form6.contributesGenderEquity',
      'adaptationAction.form6.sustainableDevelopment',
      'adaptationAction.form6.annexSupporting',
    ],
  },
];
