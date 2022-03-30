export interface ReportDataPayload {
  other_classifier?: string;
  report_information?: string;
  have_line_base?: boolean;
  have_quality_element?: boolean;
  quality_element_description?: string;
  transfer_data_with_sinamecc?: string;
  transfer_data_with_sinamecc_description?: string;
  contact?: ReportDataContact;
  report_data_change_log?: ReportDataChangeLog;
  base_line_report?: string;
  individual_report_data?: string;
  name?: string;
  description?: string;
  unit?: string;
  calculation_methodology?: string;
  measurement_frequency?: string;
  from_date?: string;
  to_date?: string;
  geographic_coverage?: string;
  disaggregation?: string;
  limitation?: string;
  additional_information?: string;
  information_source?: string;
  statistical_operation?: string;
  contact_annotation?: string;
  data_type?: string;
  other_data_type?: string;
  classifier?: string;
}

export interface ReportDataChangeLog {
  changes: string;
  change_description: string;
}

export interface ReportDataContact {
  institution?: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  user?: string;
}
