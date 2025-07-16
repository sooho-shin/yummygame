import { useDictionary } from "@/context/DictionaryContext";
import { CodeBlock, dracula } from "react-code-blocks";
export default function FairnessCrash() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("crash_text_1") }}></pre>
      <CodeBlock
        text={t("crash_code_1")}
        language="javascript"
        showLineNumbers={false}
        theme={dracula}
      />
      <pre dangerouslySetInnerHTML={{ __html: t("crash_text_2") }}></pre>
      {/*<CodeBlock*/}
      {/*  text={t("crash_code_2")}*/}
      {/*  language="javascript"*/}
      {/*  showLineNumbers={false}*/}
      {/*  theme={dracula}*/}
      {/*/>*/}
      <pre dangerouslySetInnerHTML={{ __html: t("crash_text_3") }}></pre>
    </>
  );
}
