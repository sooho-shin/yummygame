import styles from "./styles/table.module.scss";

export default function CommonTable({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles["table-box"]}>{children}</div>;
}
