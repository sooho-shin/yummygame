import { CodeBlock, dracula } from "react-code-blocks";
import { useDictionary } from "@/context/DictionaryContext";

export default function FairnessWheel() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("wheel_text_1") }}></pre>
      <CodeBlock
        text={t("wheel_code_1")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
        codeBlockStyle={{ width: "100%" }}
      />
      <pre dangerouslySetInnerHTML={{ __html: t("wheel_text_2") }}></pre>
      <CodeBlock
        text={t("wheel_code_2")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
        codeBlockStyle={{ width: "100%" }}
      />
      <pre dangerouslySetInnerHTML={{ __html: t("wheel_text_3") }}></pre>
    </>
  );
}
