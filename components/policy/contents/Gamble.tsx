import styles from "../styles/policy.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function Gamble() {
  const t = useDictionary();
  return (
    <>
      <pre dangerouslySetInnerHTML={{ __html: t("gamble") }}></pre>
      <a
        style={{
          color: `#E3E3E5`,
          fontSize: "14px",
          display: "block",
          fontWeight: "700",
          marginTop: "32px",
        }}
        href={`http://www.cyberpatrol.com/`}
        target="_blank"
        rel="noreferrer"
      >
        http://www.cyberpatrol.com/
      </a>
      <a
        style={{
          color: `#E3E3E5`,
          fontSize: "14px",
          display: "block",
          fontWeight: "700",
        }}
        href={`http://www.gamblock.com/`}
        target="_blank"
        rel="noreferrer"
      >
        http://www.gamblock.com/
      </a>
    </>
  );
}
