import styles from "../styles/policy.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
export default function Bonus() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("bonus") }}></pre>
    </>
  );
}
