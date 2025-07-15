export interface NextState {
  label: string;
  required_comments: boolean;
  state: string;
}

export enum States {
  NEW = 'new',
  SUBMITTED = 'submitted',
  IN_EVALUATION_BY_DCC = 'in_evaluation_by_DCC',
  REJECTED_BY_DCC = 'rejected_by_DCC',
  REQUESTED_CHANGES_BY_DCC = 'requested_changes_by_DCC',
  UPDATING_BY_REQUEST_DCC = 'updating_by_request_DCC',
  ACCEPTED_BY_DCC = 'accepted_by_DCC',
  REGISTERED_BY_DCC = 'registered_by_DCC',
  END = 'end',
}
