import { SubSector, Sector } from "@app/ppcn/ppcn_registry";

export interface PpcnNewFormData{
    id: string;
    geographic: GeographicLevel[];
    required_level: RequiredLevel[];
    recognition_type: RecognitionType[];
    sector: Sector[];
    subSector: SubSector[];
    organization: Organization[];

}

export interface Organization{
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

export interface GeographicLevel{
    id: Number;
    level: string;

}

export interface RequiredLevel{
    id: Number;
    level: string;

}

export interface RecognitionType{
    id: Number;
    recognition: string;

}

export interface Contact {
    full_name: string;
    email: string;
    position: string;
    phone: string;

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