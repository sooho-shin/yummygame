import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import fetchDataServer from "@/utils/fetchServer";
import { PartnerPostParamType } from "@/types/partner";

export function usePostPartner() {
  return useMutation((data: PartnerPostParamType) =>
    fetchDataServer({ url: "/partner", method: "post", data }),
  );
}
