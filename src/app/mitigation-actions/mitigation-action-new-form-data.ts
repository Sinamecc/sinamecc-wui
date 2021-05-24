export interface MitigationActionNewFormData {
	initiative_type: RegistrationType[];
	institutions: Institution[];
	statuses: Status[];
	finances: Finance[];
	ingei_compliances: IngeiCompliance[];
	geographic_scales: GeographicScale[];
	finance_source_types: FinanceSourceType[];
	finance_status: FinanceStatus[];
	initiative_types: InitiativeType[];
}

export interface RegistrationType {
	id: string;
	code: string;
	name: String;
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
	types: String;
}
