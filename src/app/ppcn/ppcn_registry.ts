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
  fsm_state: ReviewStatus;
  next_state: ReviewStatus[];

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



