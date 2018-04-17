export interface MitigationActionNewFormData {
  registrationTypes: RegistrationType[];
  institutions: Institution[];
  statuses: Status[];
  finances: Finance[];
  ingeiCompliances: IngeiCompliance[];
  geographicScale: GeographicScale[];
  
  }

  interface RegistrationType {
    id: Number;
    type: String;
  }

  interface Institution {
    id: Number;
    name: String;
  }

  interface Status {
    id: Number;
    status: String;
  }

  interface Finance {
    id: Number;
    name: String;
    source: String;
  }

  interface IngeiCompliance {
    id: Number;
    name: String;
  }

  interface GeographicScale {
    id: Number;
    name: String;
  }
