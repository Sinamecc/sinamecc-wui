import { GeographicScale } from './mitigation-action-new-form-data';
import { NextState } from '@shared/next-state';

export interface MitigationAction {
  initiative: Initiative;
  code: string;
  name: string;
  id: string;
  strategy_name: string;
  purpose: string;
  finance: Finance;
  quantitative_purpose: string;
  status: GenericStatus;
  gas_inventory: string;
  geographic_scale: GeographicScale;
  start_date: string;
  end_date: string;
  institution: Institution;
  question_ucc: string;
  question_ovv: string;
  contact: Contact;
  emissions_source: string;
  carbon_sinks: string;
  impact: string;
  impact_plan: string;
  calculation_methodology: string;
  is_international: boolean;
  international_participation: string;
  sustainability: string;
  location: Location;
  progress_indicator: ProgressIndicator;
  next_state: NextState[];
  created: string;
  updated: string;
  fsm_state: {
    state: string;
    label: string;
  };
  files: Files[];
  status_information: StatusInformation;
  geographic_location: GeographicLocation;
  categorization: any; //waiting BE have this data
  ghg_information: GHGInformation;
  impact_documentation: any;
  monitoring_information: MonitoringInformation;
  monitoring_reporting_indicator: any;
}

export interface MonitoringInformation {
  code: string;
  id: string;
  indicator: any[];
}

export interface ImpacDocumentationQuestion {
  is_checked: number;
  code: string;
  detail: string;
  id: number;
  impact_documentation: number;
  question: string;
}

export interface ImpactDocumentation {
  gases?: string;
  base_line_definition: string;
  calculation_methodology: string;
  carbon_international_commerce: boolean;
  estimate_calculation_documentation: string;
  estimate_reduction_co2: string;
  id: number;
  methodologies_to_use: string;
  mitigation_action_in_inventory: boolean;
  period_potential_reduction: string;
  question: ImpacDocumentationQuestion[];
}

export interface ImpactEmission {
  id: number;
  code: string;
  name: string;
}

export interface Goals {
  code: string;
  description: string;
  id: number;
}

export interface GHGInformation {
  graphic_description: string;
  id: number;
  impact_emission: string;
  goals: Goals[];
  impact_sector?: ImpactEmission[] | string;
  sectorsGEIInventoryImpacted: string; //waiting BE have this data
  preliminaryIdentificationSustainableDevelopmentGoals: string; //waiting BE have this data
}

export interface Indicator {
  id: number;
  name: string;
  description: string;
  type: string;
  unit: string;
  methodological_detail: string;
  reporting_periodicity: string;
  data_generating_institution: string;
  reporting_institution: string;
  measurement_start_date: string;
  additional_information: string;
  monitoring_information: number;
}

export interface Indicator {
  id: number;
  name: string;
  description: string;
  type: string;
  unit: string;
  methodological_detail: string;
  reporting_periodicity: string;
  data_generating_institution: string;
  reporting_institution: string;
  measurement_start_date: string;
  additional_information: string;
  monitoring_information: number;
}

export interface GeographicLocation {
  id: string;
  location: string;
  geographic_scale: GeographicScale;
}

export interface StatusInformation {
  end_date: string;
  id: number;
  institution: string;
  other_end_date: string;
  other_institution: string;
  start_date: string;
  status: GenericStatus;
}

export interface Initiative {
  budget: number;
  contact: Contact;
  description: string;
  entity_responsible: string;
  finance: Finance;
  goal: any;
  id: string;
  initiative_type: InitiativeType;
  objective: string;
  status: GenericStatus;
  name: string;
}
export interface ProgressIndicator {
  id: string;
  name: string;
  type: string;
  unit: string;
  start_date: string;
}
export interface Contact {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  phone: string;
  institution?: string;
}

export interface Location {
  id: string;
  geographical_site: string;
  is_gis_annexed: string;
}

export interface Institution {
  id: string;
  name: string;
}

export interface GenericStatus {
  id: string;
  status: string;
  code?: string;
}

export interface Finance {
  id: string;
  status: FinanceSourceType;
  finance_source_type: FinanceSourceType;
  source: any;
  administration?: string;
  source_description?: string;
  currency?: string;
  budget?: string;
  reference_year?: string;
  mideplan_registered?: string;
  nameRegisteredMideplan?: string;
  executing_entity?: string;
  mideplan_project?: string;
  finance_information?: FinanceInformation[];
}

export interface FinanceInformation {
  budget: string;
  currency: string;
  finance?: number;
  id?: number;
  source_description: string;
  reference_year: string;
}

export interface InitiativeType {
  id: string;
  initiative_type: string;
  name?: string;
}

export interface FinanceSourceType {
  id: string;
  name: string;
}

export interface ReviewStatus {
  status: string;
}

export interface Files {
  name: string;
  file: string;
}

export interface MADataCatalogItem {
  id: number;
  code?: string;
  name: string;
  description?: string;
  type?: string;
  status?: string;
}

export interface SectorIpcc2006 {
  id: number;
  code: string;
  name: string;
  sector: number;
}

export interface CategoryIppc2006 {
  id: number;
  code: string;
  name: string;
  sector_ipcc_2006: number;
}

export interface MADataCatalogs {
  initiative_type: MADataCatalogItem[];
  status: MADataCatalogItem[];
  finance_source_type: MADataCatalogItem[];
  finance_status: MADataCatalogItem[];
  geographic_scale: MADataCatalogItem[];
  action_areas: MADataCatalogItem[];
  descarbonization_axis: MADataCatalogItem[];
  topics: MADataCatalogItem[];
  impact_category: MADataCatalogItem[];
  sustainable_development_goals: MADataCatalogItem[];
  ghg_impact_sector: MADataCatalogItem[];
  carbon_deposit: MADataCatalogItem[];
  standard: MADataCatalogItem[];
  classifier: MADataCatalogItem[];
  information_source_type: MADataCatalogItem[];
  thematic_categorization_type: MADataCatalogItem[];
  sector: MADataCatalogItem[];
}

export interface MAFile {
  file: File;
  name: string;
}

export enum States {
  NEW = 'new',
  SUBMITTED = 'submitted',
  IN_EVALUATION_BY_DCC = 'in_evaluation_by_DCC',
  REQUESTED_CHANGES_BY_DCC = 'requested_changes_by_DCC',
  UPDATING_BY_REQUEST_DCC = 'updating_by_request_DCC',
  ACCEPTED_BY_DCC = 'accepted_by_DCC',
  REJECTED_BY_DCC = 'rejected_by_DCC',
  REGISTERED_BY_DCC = 'registered_by_DCC',
  END = 'end',
}

export const DECIMAL_NUMBER_REGEX = '^\\d{1,18}(\\.\\d{1,2})?$';
export const AMOUNT_REGEX_STRING = '^\\d{0,15}(\\.\\d{0,2})?$';
