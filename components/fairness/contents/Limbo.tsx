import { useDictionary } from "@/context/DictionaryContext";
import { CodeBlock, dracula } from "react-code-blocks";
export default function FairnessLimbo() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("limbo_text_1") }}></pre>
      <CodeBlock
        text={t("limbo_code_1")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
      />
      <pre dangerouslySetInnerHTML={{ __html: t("limbo_text_2") }}></pre>
      <pre dangerouslySetInnerHTML={{ __html: t("limbo_text_3") }}></pre>
    </>
  );
}
