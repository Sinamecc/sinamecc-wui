export interface MitigationActionNewFormData {
  registration_types: RegistrationType[];
  institutions: Institution[];
  statuses: Status[];
  finances: Finance[];
  ingei_compliances: IngeiCompliance[];
  geographic_scales: GeographicScale[];
  finance_source_types: FinanceSourceType[];
  finance_status: FinanceStatus[];
  }

 export interface RegistrationType {
    id: string;
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

export interface FinanceSourceType {
  id: Number;
  name: String;
}

export interface FinanceStatus {
  id: Number;
  status: String;
}



export interface InitiativeType {
  id: Number;
  name: String;
}