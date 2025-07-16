import { useDictionary } from "@/context/DictionaryContext";
export default function Underage() {
  const t = useDictionary();
  // return <div dangerouslySetInnerHTML={{ __html: html }}></div>;
  return <pre dangerouslySetInnerHTML={{ __html: t("underage") }}></pre>;
}
