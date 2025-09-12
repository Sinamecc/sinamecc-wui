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
  other: string;
  specific_impact: SpecficImpact[];
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
  impact_identification: ImpactIdentification;
}

export interface CategoryGroupInput {
  dimension_list: DimensionInput[];
}

export interface CharacteristicInput {
  category_ct_list: {
    code_category_ct: string;
  }[];
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

export interface SpecficImpact {
  description: string;
  characteristic: number;
  indicator: number;
  base_value: string;
  expected_value: string;
  accumulated_value: string;
}

export interface BarrierOption {
  code: string;
  name: string;
  description: string;
}

export interface OtherBarrierOption {
  description: string;
}

export interface ImpactIdentification {
  vision: string;
  short_term: string;
  medium_term: string;
  long_term: string;
  barrier_option: BarrierOption[];
  other_barrier_option: OtherBarrierOption[];
  is_directly_addressed: boolean;
}
