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
  indicator: number;
}

export interface RegistrationType {
  id: string;
  code: string;
  name: string;
}

export interface Institution {
  id: number;
  name: string;
}

export interface Status {
  id: number;
  status: string;
}

export interface Finance {
  id: number;
  name: string;
  source: any;
}

export interface IngeiCompliance {
  id: number;
  name: string;
}

export interface GeographicScale {
  id: number;
  name: string;
  code?: string;
}

export interface FinanceSourceType {
  id: number;
  name: string;
}

export interface FinanceStatus {
  id: number;
  status: string;
}
export interface InitiativeType {
  id: number;
  types: string;
}

export interface DescarbonizationAxis {
  id: number;
  code?: string;
  description?: string;
}

export interface SustainableDevelopmentGoals {
  id: number;
  code?: string;
  description?: string;
}

export interface GhgImpactSector {
  id: number;
  name: string;
  code?: string;
}
