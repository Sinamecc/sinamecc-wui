import { CommentsStructure } from '@app/@shared/comment';

export const commentsStructureModule1: CommentsStructure[] = [
  {
    module: 'reportData.dataReport',
    fields: [
      'reportData.whatInformationReported',
      'reportData.isBaseline',
      'reportData.form1.reportBaselineIndicator',
      'reportData.form1.individualValueReport',
      'reportData.qualityPreItems',
      'reportData.form1.previousElementQuality',
      'reportData.agreementTransferSINAMECC',
      'reportData.form1.agreementsTransfer',
      'reportData.form1.howReportData',
      'reportData.form1.individualValue',
    ],
  },
];

export const commentsStructureModule2: CommentsStructure[] = [
  {
    module: 'reportData.form2.technicalInfo',
    fields: [
      'reportData.form2.recordName',
      'reportData.form2.description',
      'reportData.form2.unit',
      'reportData.form2.calculationMethodology',
      'reportData.form2.frecuency',
      'reportData.form2.frecuencyOther',
      'mitigationAction.timeSeriesAvailable',
      'general.until',
      'mitigationAction.geographicCoverage',
      'general.other',
      'reportData.form2.disaggregation',
      'reportData.form2.limitations',
      'reportData.form2.sustainabilityEnsured',
      'reportData.form2.observations',
      'reportData.form2.informationSources',
      'reportData.form2.responsibleInstitution',
      'adaptationAction.form4.sourceTyp',
      'mitigationAction.statisticalOperationName',
    ],
  },
  {
    module: 'info.contactInfo',
    fields: [
      'info.name',
      'general.positionPerson',
      'info.emailAddress',
      'info.phone',
      'reportData.additionalAnnotations',
    ],
  },
  {
    module: 'Categorización temática',
    fields: ['mitigationAction.datatype', 'mitigationAction.SINAMECCClassifiers'],
  },
];

export const commentsStructureModule3: CommentsStructure[] = [
  {
    module: 'reportData.form3.title',
    fields: ['mitigationAction.dateLastUpdate', 'mitigationAction.changesLastupdate', 'reportData.form3.description'],
  },
];
