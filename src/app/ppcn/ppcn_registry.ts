export interface Ppcn {
  id: string;
  geographicLevel: GeographicLevel;
  recognitionType: RecognitionType;
  requiredLevel: RequiredLevel;
  organization: Organization;
  sector: Sector;
  subsector: SubSector;
  contact: Contact;
  base_year: string;
  ovv: Ovv[];
  gei_organization: GeiOrganization;
  fsm_state: string;
  next_state: string;
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

export interface RecognitionType{
    id: Number;
    recognition_type: string;
}

export interface Organization {
  id: Number;
  name: string;
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
  emission_OVV: string;
  report_date_start: string;
  report_date_end: string;
  base_year: string;

}


