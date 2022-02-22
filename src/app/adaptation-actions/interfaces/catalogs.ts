export interface Topic {
	id?: number;
	code: string;
	name: string;
	created?: string;
	updated?: string;
}

export interface SubTopics {
	id?: number;
	code: string;
	name: string;
	topic: number;
	created?: string;
	updated?: string;
}

export interface ODS {
	id?: number;
	code: string;
	name: string;
	created?: string;
	updated?: string;
}

export interface TemporalityImpact {
	id?: number;
	code: string;
	name: string;
	created?: string;
	updated?: string;
}

export const adaptationsActionsTypeMap = {
	1: "Tipo A - Instrumentos de políticas y planes",
	2: "Tipo B - Proyecto y programas",
	3: "Tipo C - Actividad"
};

export const reportingEntityTypeMap = {
	1: "Entidad pública",
	2: "Entidad privada",
	3: "Municipalidad",
	4: "ONG"
};

export const provinciaMap = {
	1: "Alajuela",
	2: "San José",
	3: "Limón",
	4: "Puntarenas",
	5: "Guanacaste",
	6: "Cartago",
	7: "Heredia"
};

export const adaptationActionClimateThreaMap = {
	1: "Deslizamiento",
	2: "Inundación",
	3: "Avenida torrencial",
	4: "Ola de calor",
	5: "Sequía",
	6: "Otro"
};
