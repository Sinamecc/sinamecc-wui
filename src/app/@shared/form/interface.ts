export interface SustainableDevelopmentImpactPayload {
  result: { scale: ImpactScale[] }[];
  category_option: CategoryOption;
}

export interface TransformationalChangePayload {
  final_result: { scale: ImpactScale[] }[];
  process: ImpactProcess;
}

export interface ImpactScale {
  id?: number;
  code: string;
  name: string;
  category_result: {
    id?: number;
    code: string;
    name: string;
  }[];
}

export interface ImpactProcess {
  id?: number;
  characteristics: number[];
  other: string;
  specific_impact: null; // TODO: fix
}

export interface CategoryOption {
  id?: number;
  category_section: {
    category: number;
    description: string;
  }[];
  other: {
    name: string;
    description: string;
  }[];
  impact_type: boolean;
  pertinent: boolean;
  relevant: boolean;
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

export interface CategoryGroupInput {
  dimension_list: {
    code_dimension: string;
  }[];
}

export interface CategoryInput {
  category_group_list: { code_category_group: string; code_dimension: string }[];
}

export interface CategoryGroupInput {
  dimension_list: { code_dimension: string }[];
}

export interface BaseEntity {
  id: number;
  code: string;
  name: string;
  created: string;
  updated: string;
}
export interface Dimension extends BaseEntity {}

export interface CategoryGroup extends BaseEntity {
  dimension: Dimension;
}

export interface Category extends BaseEntity {
  category_group: CategoryGroup;
  other_category: string | null;
  description: string;
}

export interface CategoryCT extends BaseEntity {}

export interface Characteristic extends BaseEntity {
  category_ct: CategoryCT;
}
