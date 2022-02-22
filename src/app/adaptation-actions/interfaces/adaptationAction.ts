export interface ReportOrganization {
  responsible_entity: string;
  legal_identification: string;
  elaboration_date: string;
  entity_address: string;
  report_organization_type: string;
  //ontact: any; // todo define type
}

export interface Adress {
  description: string;
  GIS: string;
  district: string;
}

export interface AdaptationActionInformation {
  name: string;
  objective: string;
  description: string;
  meta: string;
  adaptation_action_type: string;
  ods: number[];
}

export interface Activity {
  code: string;
  description: string;
  sub_topic: number;
  ndc_contribution: number[];
  adaptation_axis_guideline: number;
}

export interface Instrument {
  name: string;
  description: string;
}

export interface ClimateThreat {
  type_climated_threat: string;
}

export interface Implementation {
  id?: string;
  start_date: string;
  end_date: string;
  duration: string;
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
  source: number[];
  finance_instrument: number[];
}

export interface InformationSource {
  responsible_institution: string;
  type_information: string;
  Other_type: string;
  statistical_operation: string;
}

export interface Indicator {
  name: string;
  description: string;
  unit: string;
  methodological_detail: string;
  reporting_periodicity: string;
  available_time_start_date: string;
  geographic_coverage: string;
  other_geographic_coverage: string;
  disaggregation: string;
  limitation: string;
  additional_information: string;
  comments: string;
  information_source: InformationSource;
  type_of_data: string;
  other_type_of_data: string;
  classifier: number[];
  other_classifier: string;
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
  indicator_source: number[];
}

export interface ActionImpact {
  gender_equality: string;
  gender_equality_description: string;
  unwanted_action: string;
  unwanted_action_description: string;
  general_impact: number;
  temporality_impact: number[];
  ods: number[];
}

export interface State {
  state: string;
  label: string;
  required_comments?: Boolean;
}

export interface AdaptationAction {
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
  indicator_monitoring?: IndicatorMonitoring;
  action_impact?: ActionImpact;
  created?: string;
  updated?: string;
  next_state?: State[];
  fsm_state?: State;
}
