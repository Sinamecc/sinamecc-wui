import { Contact } from './contact';

export interface Organization {
  id: Number;
  name: string;
  legal_identification: string;
  representative_legal_identification: string;
  confidential: string;
  confidential_fields: string;
  representative_name: string;
  phone_organization: string;
  postal_code: string;
  fax: string;
  ciiu_code: object[];
  address: string;
  contact: Contact;
}
