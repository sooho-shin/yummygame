import OriginalWrapper from "@/components/provider/OriginalWrapper";
import ProviderWrapper from "@/components/provider/ProviderWrapper";
import { categoryGameType } from "@/types/provider";
import { getCategoryCode } from "@/utils";

export default function CategoryCodePage({
  params,
}: {
  params: { categoryGameName: categoryGameType };
}) {
  if (getCategoryCode(params.categoryGameName) === null) {
    return <></>;
  } else if (getCategoryCode(params.categoryGameName) === "0") {
    return <OriginalWrapper />;
  } else {
    return (
      <>
        <ProviderWrapper
          categoryCode={getCategoryCode(params.categoryGameName) ?? "card"}
        />
      </>
    );
  }
}
