import { ReactNode } from "react";
import styles from "./styles/button.module.scss";

export default function CommonButton({
  text,
  isPending = false,
  className,
  onClick,
  btnSub,
  disabled = false,
}: {
  text: string;
  isPending: boolean;
  className?: string;
  onClick: () => void;
  btnSub?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${className && className}
      
      
      `}
      onClick={() => !isPending && onClick()}
      disabled={disabled || isPending}
    >
      {isPending ? (
        <div className={styles.loader}></div>
      ) : (
        <>
          <span>{text}</span>
          {btnSub && btnSub}
        </>
      )}
    </button>
  );
}
