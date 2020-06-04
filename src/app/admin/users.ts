import { Permissions } from './permissions';
import { Groups } from './groups';

export interface User {
        first_name: string;
        last_name: string;
        id: string;
        username: string;
        email: string;
        is_active: boolean;
        is_provider: boolean;
        is_administrador_dcc: boolean;
        is_staff: boolean;
        groups: Groups [];
        permission_app: Permissions [];

}
