import { buyerAccount } from "./mccr-poc-buyer-account";
import { developerAccount } from "./mccr-poc-developer-account";

export interface MccrPoc {
    ucc_code:string;
    minusq_account:Number;
    generation_account:Number;
    reserve_account:Number;
    developer_account:developerAccount;
    final_balance:Number;
    buyer_account:buyerAccount;
    cancellation_account:Number;
    
}

