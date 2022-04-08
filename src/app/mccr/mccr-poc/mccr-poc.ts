import { BuyerAccount } from './mccr-poc-buyer-account';
import { DeveloperAccount } from './mccr-poc-developer-account';

export interface MccrPoc {
  ucc_code: string;
  minusq_account: Number;
  generation_account: Number;
  reserve_account: Number;
  developer_account: DeveloperAccount;
  final_balance: Number;
  buyer_account: BuyerAccount;
  cancellation_account: Number;
}

export interface VerifyDetails {
  metadata_id: string;
  block_address: any;
  document_hash: string;
  revision_verified: boolean;
  block_verified: boolean;
}

export interface VerifyResponse {
  ucc_code: string;
  verified_blocks: boolean;
  verified_revisions: boolean;
  details: VerifyDetails[];
}
