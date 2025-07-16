import styles from "./styles/mainWrapper.module.scss";
import { useDictionary } from "@/context/DictionaryContext";

export default function MainGambling() {
  const t = useDictionary();
  return (
    <div className={styles["main-gambling-wrapper"]}>
      <div className={styles.top}>
        <h5>{t("main_70")}</h5>
        <p>{t("main_71")}</p>
      </div>
      <div className={styles["content-group"]}>
        <div className={styles.content}>
          <pre>{t("main_80")}</pre>
          <ul>
            <li>
              <span>{t("main_72")}</span>
            </li>
            <li>
              <span>{t("main_73")}</span>
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          <pre>{t("main_81")}</pre>
          <ul>
            <li>
              <span>{t("main_74")}</span>
            </li>
            <li>
              <span>{t("main_75")}</span>
            </li>
          </ul>
        </div>
        <div className={styles.content}>
          <pre>{t("main_76")}</pre>
          <ul>
            <li>
              <span>{t("main_77")}</span>
            </li>
            <li>
              <span>{t("main_78")}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
