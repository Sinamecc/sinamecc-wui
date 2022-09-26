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
  topic: Topic;
  created?: string;
  updated?: string;
}

export interface Activities {
  id?: number;
  code: string;
  description: string;
  sub_topic: any;
  ndc_contribution: any;
  adaptation_axis_guideline: any;
  created: string;
  updated: string;
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
  1: 'Tipo A - Instrumentos de políticas y planes',
  2: 'Tipo B - Proyecto y programas',
  3: 'Tipo C - Actividad',
};

export const reportingEntityTypeMap = {
  1: 'Entidad pública',
  2: 'Entidad privada',
  3: 'Municipalidad',
  4: 'ONG',
};

export const provinciaMap = {
  1: 'Alajuela',
  2: 'San José',
  3: 'Limón',
  4: 'Puntarenas',
  5: 'Guanacaste',
  6: 'Cartago',
  7: 'Heredia',
};

export const adaptationActionClimateThreaMap = {
  1: 'Deslizamiento',
  2: 'Inundación',
  3: 'Avenida torrencial',
  4: 'Ola de calor',
  5: 'Sequía',
  6: 'Otro',
};

export const adaptationActionFinanceStatusMap = {
  1: 'Asegurado',
  2: 'Por obtener',
};

export const financeInstrumentMap = {
  1: 'Fondos',
  2: 'Préstamos tradicionales',
  3: 'Préstamos concesionales',
  4: 'Subsidios',
  5: 'Garantías',
};

export const indicatorsTypeOfDataMap = {
  0: 'Gestión',
  1: 'Resultado',
  2: 'Otro',
};

export const classifiersSINAMECCMap = {
  1: 'Acción Climática',
  2: 'Modelación',
  3: 'INGEI',
  4: 'Reportes',
  5: 'Otro',
};

export const actionState = {
  1: 'No iniciada',
  2: 'Iniciada',
  3: 'Finalizada',
};

export const AppScale = {
  1: 'Nacional',
  2: 'Regional',
  3: 'Local',
};

export const ReportingPeriodicity = {
  YEARLY: 'Anual',
  BIANNUAL: 'Semestral',
  QUARTERLY: 'Trimestral',
  OTHER: 'Otro',
};
