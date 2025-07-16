import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import fetchDataServer from "@/utils/fetchServer";
import { PartnerPostParamType } from "@/types/partner";
import { PaymentKeys } from "@/config/queryKey";
import { PaymentCurrenciesDataType } from "@/types/payment";

export function useGetPaymentCurrencies(data: {
  providerCode: "moonpay" | "banxa" | "wert";
}) {
  //   return useQuery<{ result: userCommonGnbDataType }>(
  return useQuery<PaymentCurrenciesDataType>(
    [PaymentKeys.CURRENCIES, data],
    () => {
      return fetchDataServer({
        url: `/payment/currencies`,
        data,
      });
    },
  );
}

export function usePostPaymentOffer() {
  //   return useQuery<{ result: userCommonGnbDataType }>(

  return useMutation(
    (data: {
      providerCode: "moonpay" | "banxa" | "wert";
      currencyFrom: string;
      currencyTo: string;
      amountFrom: string;
      paymentMethod?: string | null;
    }) => fetchDataServer({ url: "/payment/offer", method: "post", data }),
  );
}

export function usePostPaymentOrder() {
  //   return useQuery<{ result: userCommonGnbDataType }>(

  return useMutation(
    (data: {
      providerCode: "moonpay" | "banxa" | "wert";
      currencyFrom: string;
      currencyTo: string;
      amountFrom: string;
      paymentMethod?: string | null;
    }) => fetchDataServer({ url: "/payment/order", method: "post", data }),
  );
}
