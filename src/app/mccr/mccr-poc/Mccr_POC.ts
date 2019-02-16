

export interface Mccr_POC {
    ucc_code:string;
    minusq_account:Number;
    generation_account:Number;
    reserve_account:Number;
    developer_account:Developer_account;
    final_balance:Number;
}


export interface Developer_account{

    developer_current_debit_balance:Number;
    developer_current_credit_balance:Number;
    developer_final_balance:Number;
    
}