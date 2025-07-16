import { useDictionary } from "@/context/DictionaryContext";
import { CodeBlock, dracula } from "react-code-blocks";

export default function FairnessMines() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("mine_text_1") }}></pre>

      <CodeBlock
        text={t("mine_code_1")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
      />

      <pre dangerouslySetInnerHTML={{ __html: t("mine_text_2") }}></pre>
    </>
  );
}
