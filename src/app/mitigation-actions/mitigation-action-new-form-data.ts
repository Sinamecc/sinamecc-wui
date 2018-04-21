export interface MitigationActionNewFormData {
  registrationTypes: RegistrationType[];
  institutions: Institution[];
  statuses: Status[];
  finances: Finance[];
  ingei_compliances: IngeiCompliance[];
  geographic_scales: GeographicScale[];
  
  }

 export interface RegistrationType {
    id: Number;
    type: String;
  }

  export interface Institution {
    id: Number;
    name: String;
  }

  export interface Status {
    id: Number;
    status: String;
  }

  export interface Finance {
    id: Number;
    name: String;
    source: String;
  }

  export interface IngeiCompliance {
    id: Number;
    name: String;
  }

  export interface GeographicScale {
    id: Number;
    name: String;
  }
