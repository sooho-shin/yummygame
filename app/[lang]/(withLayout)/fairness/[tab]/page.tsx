import FairnessWrapper from "@/components/fairness/FairnessWrapper";

export default function PolicyPage({
  params,
}: {
  params: {
    tab:
      | "crash"
      | "wheel"
      | "roulette"
      | "dice"
      | "ultimatedice"
      | "mines"
      | "flip";
  };
}) {
  return (
    <>
      <FairnessWrapper tab={params.tab} />
    </>
  );
}
