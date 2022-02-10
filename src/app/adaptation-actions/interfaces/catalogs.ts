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
