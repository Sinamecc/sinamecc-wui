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

export const getCategoriesScale = (adaptation: boolean) => {
  return [
    {
      name: `impactEvaluation.select.scale${adaptation ? 'AA' : 'MA'}`,
      code: IMPACT_EVAL_CATEGORIES.SCALE,
    },
    {
      name: `impactEvaluation.select.scaleTerm${adaptation ? 'AA' : 'MA'}`,
      code: IMPACT_EVAL_CATEGORIES.SCALE_TERM,
    },
  ];
};

export const TRANSFORMATION_CHANGE = {
  identification: 0,
  processes: 1,
  results: 2,
};

export const IMPACT_EVALUATION = {
  categories: 0,
  results: 1,
};

export const TRANSFORMATIONAL_CATEGORIES = {
  technology: 1,
  changeAgents: 2,
  incentives: 3,
  rules: 4,
};

// MOCK: DELETE: TODO
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
