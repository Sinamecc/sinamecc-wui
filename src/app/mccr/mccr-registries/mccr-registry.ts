export interface MccrRegistry {
  mitigation: string;
  id: string;
  files: string[];
  workflow_step_files: string[];
  created: string;
  updated: string;
  next_state: NextState;
  fsm_state: string;
}

export interface NextState {
  required_comments: boolean;
  states: string[];
}
