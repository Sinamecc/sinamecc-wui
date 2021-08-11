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
}

export interface Finance {
  id: string;
  status: FinanceSourceType;
  finance_source_type: FinanceSourceType;
  source: string;
}

export interface InitiativeType {
  id: string;
  initiative_type: string;
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
