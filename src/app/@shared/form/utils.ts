import { IMPACT_EVAL_CATEGORIES } from './constants';

export function getImpactEvalCategoryKey(value: string): keyof typeof IMPACT_EVAL_CATEGORIES | undefined {
  return (Object.keys(IMPACT_EVAL_CATEGORIES) as Array<keyof typeof IMPACT_EVAL_CATEGORIES>).find(
    (key) => IMPACT_EVAL_CATEGORIES[key] === value,
  );
}
