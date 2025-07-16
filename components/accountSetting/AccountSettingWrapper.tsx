import AccountSetting from "./Setting";
import styles from "./styles/accountSetting.module.scss";

export default function AccountSettingWrapper() {
  return (
    <div className={styles.wrapper}>
      <AccountSetting />
    </div>
  );
}
