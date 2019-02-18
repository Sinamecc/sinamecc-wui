

export interface MccrPoc {
    ucc_code:string;
    minusq_account:Number;
    generation_account:Number;
    reserve_account:Number;
    developer_account:developerAccount;
    final_balance:Number;
    buyer_account:Buyer_account;
}


export interface developerAccount{

    developer_current_debit_balance:Number;
    developer_current_credit_balance:Number;
    developer_final_balance:Number;
    
}

export interface Buyer_account{
    buyer_current_debit_balance:Number;
    buyer_current_credit_balance:Number;
    buyer_final_balance:Number;
}