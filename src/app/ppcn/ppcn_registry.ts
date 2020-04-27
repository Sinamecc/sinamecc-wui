import { NextState } from '@app/shared/next-state';

export interface Ppcn {
  id: string;
  geographic_level: GeographicLevel;
  organization: Organization;
  organization_classification:organizationClassification;
  contact: Contact;
  base_year: string;
  ovv: Ovv[];
  gei_organization: GeiOrganization;
  fsm_state: string;
  next_state: NextState;
  files: Files[];
}

export interface RequiredLevel
{
  id: Number;
  level_type: string;
}
export interface GeographicLevel {
  id: Number;
  level: string;

}

export interface organizationClassification{
  emission_quantity:string;
  buildings_number:string;
  required_level:RequiredLevel;
  data_inventory_quantity:string;
  recognition_type:RecognitionType;
  reduction:Reduction;
  carbon_offset:Compensation;
}

export interface Reduction{
  proyect:string;
  activity:string;
  detail_reduction:string;
  emission:string;
  total_emission:string;
  investment:string;
  investment_currency:string;
  total_investment:string;
  total_investment_currency:string;

}

export interface Compensation{
  certificate_identification:string;
  offset_cost:string;
  offset_cost_currency:string;
  offset_scheme:string;
  period:string;
  project_location:string;
  total_carbon_offset:string;
  total_offset_cost:string;
  total_offset_cost_currency:string;
}

export interface RecognitionType{
    id: Number;
    recognition_type: string;
}

export interface Organization {
  id: Number;
  name: string;
  legal_identification:string;
  representative_legal_identification:string;
  confidential:string;
  confidential_fields:string;
  representative_name: string;
  phone_organization: string;
  postal_code: string;
  fax: string;
  ciiu: string;
  address: string;
  contact: Contact;
}

export interface Sector{
  id: Number;
  sector: string;
}

export interface SubSector{
  id: Number;
  name: string;
  sector: Sector;

}

export interface Contact {
  full_name: string;
  email: string;
  job_title: string;
  phone: string;

  }

export interface ReviewStatus {
  status: string;

}

export interface Files{
  name: string;
  file: string;
  
}

export interface Ovv{
  id: Number;
  email: string;
  phone: string;
  name: string;
}

export interface GeiOrganization {
  id: Number;
  activity_type: string;
  ovv: Ovv;
  emission_ovv_date: string;
  report_year: string;
  base_year: string;
  gei_activity_types: GeiActivityType[];

}

export interface GeiActivityType{
  id: Number;
  sector: Sector;
  sub_sector: SubSector;
  activity_type: string;
}



