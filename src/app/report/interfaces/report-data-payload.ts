export interface ReportDataPayload {
  other_classifier: string;
  report_information: string;
  have_line_base: boolean;
  have_quality_element: boolean;
  quality_element_description: string;
  transfer_data_with_sinamecc: string;
  transfer_data_with_sinamecc_description: string;
  contact?: ReportDataContact;
  report_data_change_log?: ReportDataChangeLog;
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
