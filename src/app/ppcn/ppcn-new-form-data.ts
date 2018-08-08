export interface PpcnNewFormData{
    id: string;
    organization:Organization;
    geographic: GeographicLevel;
    requiredLevel: RequiredLevel;
    subsector: SubSector;
    contact: Contact;

}

export interface Organization{

}

export interface GeographicLevel{

}

export interface RequiredLevel{

}

export interface SubSector{

}

export interface Contact {
    full_name: string;
    email: string;
    position: string;
    phone: string;
  }