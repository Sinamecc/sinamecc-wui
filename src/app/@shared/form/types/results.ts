export interface Timestamps {
  created: string;
  updated: string;
}

export interface BaseEntity extends Timestamps {
  id: number;
  code: string;
  name: string;
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

export interface IndicatorBase {
  name: string;
  description: string;
}

export interface Indicator extends IndicatorBase {
  id: number;
}

export interface CategoryResult extends BaseEntity {}

export interface ScaleBase extends Timestamps {
  code: string;
  name: string;
  description: string;
  category_result: CategoryResult[];
  indicator: IndicatorBase;
  base_value: string;
  expected_value: string;
  accumulated_value: string;
}

export interface ScaleResult extends ScaleBase {
  id: number;
  indicator: Indicator;
}

export interface CategorySectionBase extends Timestamps {
  indicator: Indicator;
  base_value: string;
  expected_value: string;
  accumulated_value: string;
  description: string;
}

export interface CategorySectionResult extends CategorySectionBase {
  id: number;
  category: Category;
}

export interface OtherCategoryResult extends CategorySectionBase {
  id: number;
  name: string;
}

export interface CategoryOptionResult extends Timestamps {
  id: number;
  category_section: CategorySectionResult[];
  other: OtherCategoryResult[];
  impact_type: boolean;
  pertinent: boolean;
  relevant: boolean;
}

export interface ResultResult extends Timestamps {
  id: number;
  scale: ScaleResult[];
}
