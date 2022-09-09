export interface ReportOrganization {
  responsible_entity: string;
  legal_identification: string;
  elaboration_date: string;
  entity_address: string;
  report_organization_type: any;
  other_report_organization_type: string;
  contact: Contact;
}

export interface Contact {
  contact_name: string;
  contact_position: string;
  address: string;
  email: string;
  phone: string;
}

export interface ContactIndicator {
  institution: string;
  contact_name: string;
  contact_position: string;
  email: string;
  phone: string;
}

export interface Adress {
  description: string;
  GIS: string;
  district: any;
  canton: any;
  app_scale: string;
}

export interface AdaptationActionInformation {
  name: string;
  objective: string;
  description: string;
  meta: string;
  adaptation_action_type: any;
  ods: number[] | any;
}

export interface Activity {
  code: string;
  id?: string;
  description: string;
  sub_topic: any;
  ndc_contribution: any;
  adaptation_axis_guideline: any;
}

export interface Instrument {
  name: string;
}

export interface ClimateThreat {
  type_climate_threat: any;
  other_type_climate_threat: string;
  description_climate_threat: string;
  vulnerability_climate_threat: string;
  exposed_elements: string;
}

export interface Implementation {
  id?: string;
  start_date: string;
  end_date: string;

  responsible_entity: string;
  other_entity: string;
  action_code: string;
}

export interface Status {
  code: string;
  name: string;
}

export interface Mideplan {
  registry: string;
  name: string;
  entity: string;
}

export interface Finance {
  administration: string;
  budget: string;
  status: Status;
  mideplan: Mideplan;
  source: any[];
  year?: string;
  finance_instrument: number[];
}

export interface InformationSource {
  responsible_institution: string;
  type_information: any;
  other_type: string;
  statistical_operation: string;
}

export interface Indicator {
  name: string;
  id?: string;
  description: string;
  unit: string;
  methodological_detail: string;
  reporting_periodicity: string;
  geographic_coverage: string;
  other_geographic_coverage: string;
  disaggregation: string;
  limitation: string;
  additional_information: string;
  comments: string;
  information_source: InformationSource;
  type_of_data: any;
  other_type_of_data: string;
  classifier: any[];
  other_classifier: string;
  available_time_start_date?: string;
  general_report?: any; //GeneralReport;
  contact: ContactIndicator;
  available_time_end_date: string;
}

export interface ProgressLog {
  action_status: string;
  progress_monitoring: string;
}

export interface IndicatorMonitoring {
  start_date: string;
  end_date: string;
  update_date: string;
  data_to_update: string;
  indicator_source: any[];
}

export interface ActionImpact {
  gender_equality: string;
  gender_equality_description: string;
  unwanted_action: string;
  unwanted_action_description: string;
  temporality_impact: any[];
  general_impact: string;
  ods: any[];
}

export interface State {
  state: string;
  label: string;
  required_comments?: Boolean;
}

export interface GeneralReport {
  start_date: string;
  end_date: string;
  description: string;
}

export interface AdaptationAction {
  indicatorList?: any;
  report_organization?: ReportOrganization;
  address?: Adress;
  adaptation_action_information?: AdaptationActionInformation;
  activity?: Activity;
  instrument?: Instrument;
  climate_threat?: ClimateThreat;
  implementation?: Implementation;
  id?: string;
  finance?: Finance;
  indicator?: Indicator;
  progress_log?: ProgressLog;
  indicator_list?: Indicator[];
  indicator_monitoring_list?: IndicatorMonitoring[];
  action_impact?: ActionImpact;
  created?: string;
  updated?: string;
  next_state?: State[];
  fsm_state?: State;
  general_report?: any;
}

export interface Province {
  id: number;
  code: string;
  name: string;
  created: string;
  updated: string;
}

export interface Canton {
  id: number;
  code: string;
  name: string;
  province: Province;
  created: string;
  updated: string;
}

export interface District {
  id: number;
  code: string;
  name: string;
  canton: Canton;
  created: string;
  updated: string;
}

export interface ClimateThreatCatalog {
  id: number;
  code: string;
  name: string;
  created: string;
  updated: string;
}
