export interface MitigationAction {
  name: string;
  id: string;
  strategy_name: string;
  purpose: string;
  quantitative_purpose: string;
  institution: Institution;
  question_ucc: string;
  question_ovv: string;
  contact: Contact;
  location: Location;
  progress_indicator: ProgressIndicator;
  review_status: ReviewStatus;
  next_state: ReviewStatus[];
  created: string;
  updated: string;
  files: Files[];
}

export interface ProgressIndicator {
  name: string;
  type: string;
  unit: string;
  start_date: string;
}
export interface Contact {
  full_name: string;
  email: string;
  job_title: string;
  phone: string;
}

export interface Location {
  geographical_site: string;
  is_gis_annexed: string;
}

export interface Institution {
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

