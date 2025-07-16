import { useDictionary } from "@/context/DictionaryContext";
export default function Responsible() {
  const t = useDictionary();
  // return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
  return <pre dangerouslySetInnerHTML={{ __html: t("responsible") }}></pre>;
}
