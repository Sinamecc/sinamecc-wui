export interface MitigationAction {
  name: string;
  id: string;
  strategy_name: string;
  purpose: string;
  quantitative_purpose: string;
  institution: Institution;
  contact: Contact;
  location: Location;
  progress_indicator: ProgressIndicator;
  created: string;
  updated: string;
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
  position: string;
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