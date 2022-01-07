export interface ReportDataCatalog {
  classifier: CatalogObject[];
  thematic_categorization_type: CatalogObject[];
}

export interface CatalogObject {
  id: number;
  code: string;
  name: string;
}
