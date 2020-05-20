import { SubSector } from './subSector';
import { Sector } from './sector';

export interface GeiActivityType {
    id: Number;
    sector: Sector;
    sub_sector: SubSector;
    activity_type: string;
}
