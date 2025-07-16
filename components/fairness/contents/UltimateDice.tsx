import { useDictionary } from "@/context/DictionaryContext";
import { CodeBlock, dracula } from "react-code-blocks";
export default function FairnessUltimateDice() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("ultimatedice_text_1") }}></pre>
      <CodeBlock
        text={t("ultimatedice_code_1")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
      />
      <pre dangerouslySetInnerHTML={{ __html: t("ultimatedice_text_2") }}></pre>
    </>
  );
}
