import { Category } from './interface';

export const OTHER = 'other';

export const IMPACT_EVAL_CATEGORIES = {
  SCALE: '1',
  SCALE_TERM: '2',
};

export const IMPACT_SCALE = {
  MACRO: '1',
  MESO: '2',
  MICRO: '3',
};

export const IMPACT_SCALE_TERM = {
  LONG: '1',
  MEDIUM: '2',
  SHORT: '3',
};

export const IMPACT_TYPE = {
  POSITIVE: true,
  NEGATIVE: false,
};

export const IMPACT_DIMENSION = {
  AMBIENTAL: '1',
  ECONOMIC: '2',
  SOCIAL: '3',
};

export const CATEGORIES_SCALE = [
  {
    name: 'impactEvaluation.select.scale',
    code: IMPACT_EVAL_CATEGORIES.SCALE,
  },
  {
    name: 'impactEvaluation.select.scaleTerm',
    code: IMPACT_EVAL_CATEGORIES.SCALE_TERM,
  },
];

export const TRANSFORMATION_CHANGE = {
  identification: 0,
  processes: 1,
  results: 2,
};

export const IMPACT_EVALUATION = {
  categories: 0,
  results: 1,
};

// MOCK: DELETE: TODO
export const MOCK_CATEGORY_GROUP = [
  {
    code: 'GRP001',
    name: 'Aire',
    dimension: IMPACT_DIMENSION.AMBIENTAL,
  },
  {
    code: 'GRP002',
    name: 'Agua',
    dimension: IMPACT_DIMENSION.AMBIENTAL,
  },
  {
    code: 'GRP003',
    name: 'Salud y bienestar',
    dimension: IMPACT_DIMENSION.SOCIAL,
  },
];

export const MOCK_BARRIERS = [
  {
    name: 'impactEvaluation.select.politicalInstitutional',
    code: 1,
  },
  {
    name: 'impactEvaluation.select.regulatory',
    code: 2,
  },
  {
    name: 'impactEvaluation.select.socialTransformation',
    code: 3,
  },
  {
    name: 'impactEvaluation.select.technological',
    code: 4,
  },
  {
    name: 'impactEvaluation.select.capacity',
    code: 5,
  },
  {
    name: 'impactEvaluation.select.financialInvestment',
    code: 6,
  },
  {
    name: 'impactEvaluation.select.marketEconomicIncentives',
    code: 7,
  },
  {
    name: 'impactEvaluation.select.structuralInequalities',
    code: 8,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    code: 'CAT001',
    name: 'Mitigación del cambio climático',
    category_group: MOCK_CATEGORY_GROUP[0], // Aire
    other_category: null,
    description: null,
    created: '2025-01-10T10:00:00Z',
    updated: '2025-07-01T14:30:00Z',
  },
  {
    id: 2,
    code: 'CAT002',
    name: 'Calidad del aire y efectos de la contaminación atmosférica sobre la salud',
    category_group: MOCK_CATEGORY_GROUP[0], // Aire
    other_category: null,
    description: null,
    created: '2025-01-12T10:00:00Z',
    updated: '2025-07-02T14:30:00Z',
  },
  {
    id: 3,
    code: 'CAT003',
    name: 'Disponibilidad de agua',
    category_group: MOCK_CATEGORY_GROUP[1], // Agua
    other_category: null,
    description: null,
    created: '2025-02-05T09:15:00Z',
    updated: '2025-07-10T12:45:00Z',
  },
  {
    id: 4,
    code: 'CAT004',
    name: 'Calidad del agua',
    category_group: MOCK_CATEGORY_GROUP[1], // Agua
    other_category: null,
    description: null,
    created: '2025-02-10T09:15:00Z',
    updated: '2025-07-11T12:45:00Z',
  },
  {
    id: 5,
    code: 'CAT005',
    name: 'Accesibilidad y calidad de la atención sanitaria',
    category_group: MOCK_CATEGORY_GROUP[2], // Salud y bienestar
    other_category: null,
    description: null,
    created: '2025-03-05T07:40:00Z',
    updated: '2025-07-25T10:15:00Z',
  },
  {
    id: 6,
    code: 'CAT006',
    name: 'Nutrición y seguridad alimentaria',
    category_group: MOCK_CATEGORY_GROUP[2], // Salud y bienestar
    other_category: null,
    description: null,
    created: '2025-03-07T07:40:00Z',
    updated: '2025-07-26T10:15:00Z',
  },
];
