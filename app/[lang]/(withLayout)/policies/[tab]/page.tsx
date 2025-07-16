import PolicyWrapper from "@/components/policy/PolicyWrapper";

export default function PolicyPage({
  params,
}: {
  params: {
    tab:
      | "terms"
      | "gamble"
      | "aml"
      | "underage"
      | "responsible"
      | "kyc"
      | "exclusion"
      | "privacy"
      | "bonus"
      | "betting"
      | "fairness"
      | "sportsbook";
  };
}) {
  return (
    <>
      <PolicyWrapper tab={params.tab} />
    </>
  );
}
