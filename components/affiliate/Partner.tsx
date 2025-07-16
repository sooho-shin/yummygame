"use client";

import { useUserStore } from "@/stores/useUser";
import styles from "./styles/affiliate.module.scss";
import useModalHook from "@/hooks/useModalHook";
import { useDictionary } from "@/context/DictionaryContext";

export default function AffiliatePartner() {
  const { token } = useUserStore();
  const { openModal } = useModalHook();
  const t = useDictionary();

  return (
    <div className={styles["affiliate-partner-wrapper"]} id="affiliate">
      <div className={styles.content}>
        <div>
          <h5 className={styles.title}>{t("affiliate_17")}</h5>
          <pre>{t("affiliate_18")}</pre>
          <button
            type="button"
            onClick={() => {
              openModal({
                type: token ? "partner" : "getstarted",
              });
            }}
          >
            <span>{t("affiliate_19")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
