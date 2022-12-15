import { CommentsStructure } from '@app/@shared/comment';

export const commentsStructureModule1: CommentsStructure[] = [
  {
    module: 'specificLabel.initiative',
    fields: [
      'specificLabel.initiativeType',
      'specificLabel.initiativeName',
      'specificLabel.initiativeDescription',
      'specificLabel.initiativeGoal',
    ],
  },

  {
    module: 'specificLabel.initiativeContactInfo',
    fields: [
      'mitigationAction.entityReporting',
      'info.contactName',
      'general.position',
      'info.emailAddress',
      'info.emailAddress',
    ],
  },

  {
    module: 'mitigationAction.statusMitigationAction',
    fields: [
      'mitigationAction.initiativeStatus',
      'mitigationAction.startImplementation',
      'mitigationAction.deploymentCompletion',
      'general.other',
      'mitigationAction.entitiesInvolvedMitigationActionCtrl',
      'mitigationAction.entitiesInvolvedMitigationActionCtrl',
    ],
  },

  {
    module: 'general.GeographicLocation',
    fields: ['general.geographicScale', 'general.locationAction'],
  },
  {
    module: 'mitigationAction.CategorizationNationalInstruments',
    fields: [
      'mitigationAction.relationshipNDC',
      'mitigationAction.relationshipDecarbonizationPlan',
      'mitigationAction.impactCategory',
      'mitigationAction.relationshipNDC',
    ],
  },
];

export const commentsStructureModule2: CommentsStructure[] = [
  {
    module: 'info.financingInformation',
    fields: [
      'mitigationAction.financingStatus',
      'mitigationAction.stepsTakingToFinancing',
      'mitigationAction.detailfinancingSource',
      'mitigationAction.financingSourceApplying',
      'mitigationAction.mitigationActionBudget',
      'mitigationAction.referenceYear',
    ],
  },
  {
    module: 'mitigationAction.financedSourcesInternationalCooperation',
    fields: [
      'mitigationAction.registeredNonReimbursableCooperationMideplan',
      'mitigationAction.nameRegisteredMideplan',
      'mitigationAction.entityProject',
    ],
  },
];

export const commentsStructureModule3: CommentsStructure[] = [
  {
    module: 'mitigationAction.overviewImpactEmissionsRemovals',
    fields: [
      'mitigationAction.overviewImpactEmissionsRemovals',
      'mitigationAction.graphicLogicImpactEmissionsRemovals',
      'mitigationAction.sectorsGEIInventoryImpacted',
      'mitigationAction.preliminaryIdentificationSustainableDevelopmentGoals',
    ],
  },
];

export const commentsStructureModule4: CommentsStructure[] = [
  {
    module: 'specificLabel.documentationImpactEstimate',
    fields: [
      'specificLabel.exAnteEmissionReductions',
      'mitigationAction.periodPotentialEmissionReductionEstimated',
      'mitigationAction.sourcesEmissionsGasesCovered',
      'mitigationAction.carbonSinksReservoirs',
      'mitigationAction.definitionBaseline',
      'mitigationAction.methodologyExantePotentialReductionEmissionsCO2',
      'mitigationAction.documentationCalculationsEstimateReductionEmissionsCO2',
      'mitigationAction.isCurrentlyReflectedInventory',
    ],
  },
  {
    module: 'mitigationAction.QA/QCEestimate',
    fields: [
      'mitigationAction.standardizedCalculationMethodologyUsed',
      'mitigationAction.calculationsDocumented',
      'mitigationAction.emissionFactorsUsedCalculationDocumented',
      'mitigationAction.assumptionsDocumented',
    ],
  },
];

export const commentsStructureModule5: CommentsStructure[] = [
  {
    module: 'specificLabel.monitoringDetail',
    fields: [
      'mitigationAction.indicatorName',
      'mitigationAction.indicatorDescription',
      'mitigationAction.indicatorUnit',
      'mitigationAction.methodologicalDetailIndicator',
      'mitigationAction.indicatorReportingPeriodicity',
      'mitigationAction.timeSeriesAvailable',
      'general.until',
      'mitigationAction.geographicCoverage',
      'general.other',
      'mitigationAction.disintegration',
      'mitigationAction.dataSource',
      'mitigationAction.howSustainabilityIndicator',
      'mitigationAction.sinameccClassifiers',
      'mitigationAction.observationsComments',
      'mitigationAction.additionalInformation',
    ],
  },
  {
    module: 'mitigationAction.indicatorDataSource',
    fields: [
      'mitigationAction.responsibleInstitution',
      'mitigationAction.sourceType',
      'general.other',
      'mitigationAction.statisticalOperationName',
    ],
  },
  {
    module: 'mitigationAction.thematicCategorization',
    fields: ['mitigationAction.datatype', 'general.other', 'mitigationAction.SINAMECCClassifiers', 'general.other'],
  },
  {
    module: 'mitigationAction.contactInformation',
    fields: [
      'mitigationAction.namePersonResponsible',
      'reportData.institution',
      'mitigationAction.contactPersonTitle',
      'info.emailAddress',
      'info.phone',
    ],
  },
  {
    module: 'mitigationAction.changeLog',
    fields: [
      'mitigationAction.dateLastUpdate',
      'mitigationAction.changesLastupdate',
      'mitigationAction.descriptionChanges',
      'mitigationAction.authorLastUpdate',
    ],
  },
];

export const commentsStructureModule6: CommentsStructure[] = [
  {
    module: 'mitigationAction.monitoringProgressLog',
    fields: ['mitigationAction.anyProgressMonitoringRecordedClimateActions'],
  },
  {
    module: 'mitigationAction.indicatorMonitoring',
    fields: [
      'mitigationAction.indicatorSelection',
      'mitigationAction.reportingPeriod',
      'general.until',
      'mitigationAction.indicatorDataUpdateDate',
      'mitigationAction.sourceType',
    ],
  },
  {
    module: 'mitigationAction.generalProgressReportClimateAction',
    fields: ['mitigationAction.beenProgressActionPeriod'],
  },
];

export const TypeDataMap = {
  1: 'Gestión',
  2: 'Resultados',
  3: 'general.other',
};
