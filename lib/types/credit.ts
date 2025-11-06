export interface CreditResponse {
  credit: number;
}

export interface CreditChargeRequest {
  amount: number;
}

export interface CreditChargeResponse {
  currentCredit: number;
}
