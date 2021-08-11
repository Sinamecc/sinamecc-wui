import { Permissions } from './permissions';
import { Groups } from './groups';

export interface User {
  first_name: string;
  last_name: string;
  id: string;
  username: string;
  email: string;
  roles: Role[];
  groups: Groups[];
  permission_app: Permissions[];
}

export interface Role {
  role: string;
  role_name: string;
  permissions: Array<Object>;
  app: Array<string>;
}
