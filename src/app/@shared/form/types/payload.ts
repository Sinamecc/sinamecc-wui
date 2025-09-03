export interface ImpactScale {
  code: string;
  name: string;
  category_result: ImpactCategoryResult[];
}

export interface ImpactCategoryResult {
  id?: number;
  code: string;
  name: string;
}

export interface ImpactProcess {
  characteristics: number[];
  other: string;
  specific_impact: any; // TODO: fix this
}

export interface ImpactProcessResult {
  id: number;
  characteristics: number[];
  other: string;
  specific_impact: any; // TODO: fix this
}

export interface CategoryOption {
  category_section: CategorySectionInput[];
  other: OtherCategoryInput[];
  impact_type: boolean;
  pertinent: boolean;
  relevant: boolean;
}

export interface CategorySectionInput {
  category: number;
  description: string;
}

export interface OtherCategoryInput {
  name: string;
  description: string;
}

export interface SustainableDevelopmentImpactPayload {
  result: ImpactResultInput[];
  category_option: CategoryOption;
}

export interface ImpactResultInput {
  scale: ImpactScale[];
}

export interface TransformationalChangePayload {
  final_result: ImpactResultInput[];
  process: ImpactProcess;
}

export interface CategoryGroupInput {
  dimension_list: DimensionInput[];
}

export interface DimensionInput {
  code_dimension: string;
}

export interface CategoryInput {
  category_group_list: CategoryGroupListInput[];
}

export interface CategoryGroupListInput {
  code_category_group: string;
  code_dimension: string;
}

export interface IndicatorOption {
  id: string;
  name: string;
}
