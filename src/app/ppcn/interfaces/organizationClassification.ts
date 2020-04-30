import { RecognitionType } from "./recognitionType";
import { RequiredLevel } from "./requiredLevel";
import { Compensation } from "./compensation";
import { Reduction } from "./reduction";


export interface OrganizationClassification{
    emission_quantity:string;
    buildings_number:string;
    required_level:RequiredLevel;
    data_inventory_quantity:string;
    recognition_type:RecognitionType;
    reduction:Reduction;
    carbon_offset:Compensation;
}