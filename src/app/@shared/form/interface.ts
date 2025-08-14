export interface SustainableDevelopmentImpactPayload {
  result: { scale: ScalePayload[] }[];
  category_option: CategoryOptionPayload[];
}

export interface ScalePayload {
  code: string;
  name: string;
  category_result: {
    code: string;
    name: string;
  }[];
}

export interface CategoryOptionPayload {
  categories: number[];
  impact_type: boolean;
  pertinent: boolean;
  relevant: boolean;
  description: string;
  other: string;
}

export interface SustainableDevelopmentImpactResult {
  id: number;
  category: Category;
  impact_type: any;
  pertinent: any;
  relevant: any;
  result: any;
}

export interface IndicatorOption {
  name: string;
  id: string;
}

export interface Dimension {
  id: number;
  code: string;
  name: string;
  created: string;
  updated: string;
}

export interface CategoryGroupInput {
  dimension_list: {
    code_dimension: string;
  }[];
}

export interface CategoryGroup {
  id: number;
  code: string;
  name: string;
  dimension: Dimension;
  created: string;
  updated: string;
}

export interface CategoryInput {
  category_group_list: {
    code_category_group: string;
    code_dimension: string;
  }[];
}

export interface Category {
  id?: number;
  code: string;
  name: string;
  category_group: CategoryGroup;
  other_category: string | null;
  description: string;
  created: string;
  updated: string;
}
