export interface PpcnNewFormData {
  id: string;
  geographic: GeographicLevel[];
  required_level: RequiredLevel[];
  recognition_type: RecognitionType[];
  sector: Sector[];
  subSector: SubSector[];
  organization: Organization[];
  ovv: Ovv[];
  gei_organization: GeiOrganization;
}

export interface Organization {
  id: number;
  name: string;
  representative_name: string;
  phone_organization: string;
  postal_code: string;
  fax: string;
  ciiu: string;
  address: string;
  contact: Contact;
}

export interface GeographicLevel {
  id: number;
  level: string;
}

export interface RequiredLevel {
  id: number;
  level: string;
}

export interface RecognitionType {
  id: number;
  recognition: string;
}

export interface Contact {
  full_name: string;
  email: string;
  position: string;
  phone: string;
}

export interface Sector {
  id: number;
  sector: string;
}

export interface SubSector {
  id: number;
  name: string;
  sector: Sector;
}

export interface Ovv {
  id: number;
  email: string;
  phone: string;
  name: string;
}

export interface GeiOrganization {
  id: number;
  activity_type: string;
  ovv: Ovv;
  emission_OVV: string;
  report_date_start: string;
  report_date_end: string;
  base_year: string;
  gei_activity_types: GeiActivityType[];
}

export interface GeiActivityType {
  id: number;
  sector: Sector;
  sub_sector: SubSector;
  activity_type: string;
}
