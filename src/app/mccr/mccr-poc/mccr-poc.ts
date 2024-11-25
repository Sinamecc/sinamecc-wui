import { BuyerAccount } from './mccr-poc-buyer-account';
import { DeveloperAccount } from './mccr-poc-developer-account';

export interface MccrPoc {
  ucc_code: string;
  minusq_account: number;
  generation_account: number;
  reserve_account: number;
  developer_account: DeveloperAccount;
  final_balance: number;
  buyer_account: BuyerAccount;
  cancellation_account: number;
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
