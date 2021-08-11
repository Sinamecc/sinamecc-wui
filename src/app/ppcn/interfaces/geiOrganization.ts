import { GeiActivityType } from './geiActivityType';
import { Ovv } from './ovv';

export interface GeiOrganization {
  id: Number;
  activity_type: string;
  ovv: Ovv;
  emission_ovv_date: string;
  report_year: string;
  base_year: string;
  gei_activity_types: GeiActivityType[];
}
