import { NextState } from '@app/shared/next-state';

import { GeographicLevel } from './interfaces/geographicLevel';
import { OrganizationClassification } from './interfaces/organizationClassification';
import { Organization } from './interfaces/organization';
import { Contact } from './interfaces/contact';
import { GeiOrganization } from './interfaces/geiOrganization';
import { Ovv } from './ppcn-new-form-data';
import { Files } from './interfaces/files';
import { GasRemoval } from './interfaces/gasRemoval';

export interface Ppcn {
  id: string;
  geographic_level: GeographicLevel;
  organization: Organization;
  organization_classification: OrganizationClassification;
  contact: Contact;
  base_year: string;
  ovv: Ovv[];
  gei_organization: GeiOrganization;
  fsm_state: string;
  next_state: NextState;
  files: Files[];
  gas_removal:GasRemoval[];
}








