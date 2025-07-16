export interface PaymentCurrenciesDataType {
  code: number;
  message: string;
  result: {
    country: {
      countryCode: string;
      stateCode: string;
      fiat: string;
    };
    fiat: string[];
    crypto: string[];
  };
}

export interface PaymentOfferDataType {
  providerCode: "moonpay" | "banxa" | "wert";
  rate: string;
  invertedRate: string;
  fee: string;
  amountFrom: string;
  amountExpectedTo: string;
  paymentMethodOffer: {
    amountExpectedTo: string;
    method: "card" | "apple_pay";
    methodName: "Visa / Mastercard" | "Apple Pay / Google Pay";
    rate: string;
    invertedRate: string;
    fee: string;
  }[];
}
