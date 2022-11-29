export interface FMSState {
  state: string;
  label: string;
}

export interface NextState {
  state: string;
  label: string;
  required_comments: boolean;
}

export interface ChangeLog {
  id: number;
  report_data: number;
  changes: string;
  change_description: string;
  author: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    email: string;
    is_active: boolean;
    is_provider: boolean;
    is_administrador_dcc: boolean;
    phone: string;
  };
  updated: string;
}

export interface Contact {
  id: number;
  institution: string;
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  user: null;
  created: string;
  updated: string;
}

export interface Comments {
  form_section: string;
  field: string;
  comment: string;
}

export interface Report {
  id: number;
  fsm_state: FMSState;
  user: number;
  have_line_base: boolean;
  name: string;
  description: string;
  unit: string;
  calculation_methodology: string;
  measurement_frequency: string;
  measurement_frequency_other: string;
  from_date: string;
  to_date: string;
  geographic_coverage: string;
  geographic_coverage_other: string;
  disaggregation: string;
  limitation: string;
  additional_information: string;
  sustainable: null;
  responsible_institution: string;
  information_source: any[];
  statistical_operation: string;
  contact: Contact;
  contact_annotation: string;
  data_type: any;
  other_data_type: string;
  classifier: any[];
  other_classifier: string;
  report_information: string;
  have_base_line: boolean;
  base_line_type: string;
  base_line_report: string;
  have_quality_element: boolean;
  quality_element_description: string;
  transfer_data_with_sinamecc: boolean;
  transfer_data_with_sinamecc_description: string;
  report_data_type: string;
  individual_report_data: string;
  review_count: number;
  comments: Comments[];
  created: string;
  updated: string;
  report_data_change_log: ChangeLog[];
  files: ReportFile[];
  next_action: NextState[];
}

export interface ReportFile {
  id: number;
  slug: string;
  file: string;
  report_data: number;
  report_type: string;
}

export const baseLineFile = 'base_line_report';
export const reportFile = 'report_file';
