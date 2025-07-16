import AffiliateMemberHistory from "./MemberHistory";
import AffiliateNotice from "./Notice";
import AffiliatePartner from "./Partner";
import AffiliateShare from "./Share";
import AffiliateStatus from "./Status";
import AffiliateTop from "./Top";
import styles from "./styles/affiliate.module.scss";

export default function AffiliateWrapper() {
  return (
    <div className={styles.wrapper}>
      <AffiliateTop />
      <AffiliateShare />
      <AffiliateStatus />
      <AffiliateMemberHistory />
      <AffiliatePartner />
      <AffiliateNotice />
    </div>
  );
}
