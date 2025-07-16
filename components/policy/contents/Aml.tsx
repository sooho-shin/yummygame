import { useDictionary } from "@/context/DictionaryContext";
export default function Aml() {
  const t = useDictionary();
  // return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
  return <pre dangerouslySetInnerHTML={{ __html: t("aml") }}></pre>;
}
