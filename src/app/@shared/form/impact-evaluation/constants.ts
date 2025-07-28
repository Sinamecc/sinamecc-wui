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
  POSITIVE: '1',
  NEGATIVE: '2',
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

// MOCK: DELETE: TODO
export const MOCK_CATEGORY_GROUP = [
  {
    code: 'GRP001',
    name: 'Environmental Management',
    dimension: IMPACT_DIMENSION.AMBIENTAL,
  },
  {
    code: 'GRP002',
    name: 'Social Development',
    dimension: IMPACT_DIMENSION.SOCIAL,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    code: 'CAT001',
    name: 'Reforestation Projects',
    category_group: MOCK_CATEGORY_GROUP[0],
    other_category: null,
    description: null,
    created: '2025-01-10T10:00:00Z',
    updated: '2025-07-01T14:30:00Z',
  },
  {
    id: 2,
    code: 'CAT002',
    name: 'Waste Management Education',
    category_group: MOCK_CATEGORY_GROUP[1],
    other_category: null,
    description: null,
    created: '2024-12-05T08:15:00Z',
    updated: '2025-07-10T12:45:00Z',
  },
  {
    id: 3,
    code: 'CAT003',
    name: 'Wetland Restoration',
    category_group: MOCK_CATEGORY_GROUP[0],
    other_category: null,
    description: null,
    created: '2024-11-20T11:20:00Z',
    updated: '2025-06-28T09:00:00Z',
  },
  {
    id: 4,
    code: 'CAT004',
    name: 'Community Health Workshops',
    category_group: MOCK_CATEGORY_GROUP[1],
    other_category: null,
    description: null,
    created: '2025-02-15T13:50:00Z',
    updated: '2025-07-22T15:30:00Z',
  },
  {
    id: 5,
    code: 'CAT005',
    name: 'Urban Heat Island Mitigation',
    category_group: MOCK_CATEGORY_GROUP[0],
    other_category: null,
    description: null,
    created: '2025-03-05T07:40:00Z',
    updated: '2025-07-25T10:15:00Z',
  },
];
