export interface ReportDataCatalog {
  classifier: CatalogObject[];
  thematic_categorization_type: CatalogObject[];
}

export interface CatalogObject {
  id: number;
  code: string;
  name: string;
}

export const formationReportedMap = {
  statistics_or_variable: 'Una variable o estadística',
  indicator: 'Indicador',
  data_base: 'Base de datos',
};

export const reportingPeriodicity = {
  yearly: 'Anual',
  biannual: 'Semestral',
  quartely: 'Trimestral',
  other: 'Otro',
};
