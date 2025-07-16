import classNames from "classnames";
import styles from "./styles/loading.module.scss";

export default function CommonLoading() {
  return (
    <div className={classNames(styles.wrapper)}>
      <div className={styles.content}>
        <div></div>
      </div>
    </div>
  );
}
