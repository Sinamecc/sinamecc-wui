import { GeographicScale } from './mitigation-action-new-form-data';
import { NextState } from '@shared/next-state';

export interface MitigationAction {
  initiative: Initiative;
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
  next_state: NextState;
  created: string;
  updated: string;
  fsm_state: string;
  files: Files[];
  status_information: StatusInformation;
  geographic_location: GeographicLocation;
  CategorizationNationalInstruments: any; //waiting BE have this data
  ghg_information: GHGInformation;
  impact_documentation: any;
}

export interface ImpacDocumentationQuestion {
  check: number;
  code: string;
  detail: string;
  id: number;
  impact_documentation: number;
  question: string;
}

export interface ImpactDocumentation {
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

export interface GHGInformation {
  graphic_description: string;
  id: number;
  impact_emission: string;
  sectorsGEIInventoryImpacted: string; //waiting BE have this data
  preliminaryIdentificationSustainableDevelopmentGoals: string; //waiting BE have this data
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
  goal: string;
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
  source: string;
  administration?: string;
  source_description?: string;
  currency?: string;
  budget?: string;
  reference_year?: string;
  mideplan_registered?: string;
  nameRegisteredMideplan?: string;
  executing_entity?: string;
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
