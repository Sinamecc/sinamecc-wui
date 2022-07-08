export interface MitigationActionNewFormData {
  initiative_type: RegistrationType[];
  institutions: Institution[];
  status: Status[];
  finances: Finance[];
  ingei_compliances: IngeiCompliance[];
  geographic_scale: GeographicScale[];
  finance_source_types: FinanceSourceType[];
  finance_status: FinanceStatus[];
  initiative_types: InitiativeType[];
  monitoring_reporting_indicator: any;
  carbon_deposit: RegistrationType[];
  action_areas: RegistrationType[];
  descarbonization_axis: DescarbonizationAxis[];
  sustainable_development_goals: SustainableDevelopmentGoals[];
  ghg_impact_sector: GhgImpactSector[];
  topics: Topics[];
}

export interface Topics {
  code: string;
  id: number;
  name: string;
}

export interface MonitoringReportingIndicator {
  initial_date_report_period: string;
  final_date_report_period: string;
  data_updated_date: string;
  updated_data: string;
  progress_report: string;
  indicator: Number;
}

export interface RegistrationType {
  id: string;
  code: string;
  name: String;
}

export interface Institution {
  id: Number;
  name: String;
}

export interface Status {
  id: Number;
  status: String;
}

export interface Finance {
  id: Number;
  name: String;
  source: String;
}

export interface IngeiCompliance {
  id: Number;
  name: String;
}

export interface GeographicScale {
  id: Number;
  name: String;
  code?: String;
}

export interface FinanceSourceType {
  id: Number;
  name: String;
}

export interface FinanceStatus {
  id: Number;
  status: String;
}
export interface InitiativeType {
  id: Number;
  types: String;
}

export interface DescarbonizationAxis {
  id: Number;
  code?: String;
  description?: String;
}

export interface SustainableDevelopmentGoals {
  id: Number;
  code?: String;
  description?: String;
}

export interface GhgImpactSector {
  id: Number;
  name: String;
  code?: String;
}
