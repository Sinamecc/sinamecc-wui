export interface SustainableDevelopmentImpactPayload {
  category: any;
  impact_type: any;
  pertinent: any;
  relevant: any;
  result: any;
}

export interface SustainableDevelopmentImpactResult {
  id: number;
  category: Category;
  impact_type: any;
  pertinent: any;
  relevant: any;
  result: any;
}

export interface Category {
  id?: number;
  code: string;
  name: string;
  category_group: {
    code: string;
    name: string;
    dimension: string;
  };
  other_category: string | null;
  description: string;
  created: string;
  updated: string;
}
