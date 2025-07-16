import styles from "../styles/policy.module.scss";
import { useDictionary } from "@/context/DictionaryContext";
export default function Self() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("self") }}></pre>
    </>
  );
}
