import Link from "next/link";
import styles from "./styles/error.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ErrorComponent({
  type,
}: {
  type: "block" | "404" | "maintenance" | "comingsoon";
}) {
  return (
    <>
      {type === "404" && (
        <div className={styles["error-wrapper"]}>
          <div className={styles["text-group"]}>
            <div className={styles.logo}>
              <img src="/images/error/img_logo.png" />
            </div>
            <div className={styles.title}>This page isn’t found</div>
            <p>
              Please make sure that the requested url is incorrect, changed, or
              deleted. HTTP ERROR 404
            </p>
            <Link href={"/"}>Go to Home</Link>
          </div>
          <div className={styles.img}>
            <img src="/images/error/img_404.png" />
          </div>
        </div>
      )}
      {type === "block" && (
        <div className={styles["error-wrapper"]}>
          <div className={styles["text-group"]}>
            <div className={styles.logo}>
              <img src="/images/error/img_logo.png" />
            </div>
            <div className={styles.title}>
              This service unavailable in your location
            </div>
            <p>
              If you think you are receiving this message in error or for any
              other queries, Please contact us at{" "}
              <a href="mailto:support@yummygame.io">support@yummygame.io.</a>
            </p>
          </div>
          <div className={styles.img}>
            <img src="/images/error/img_blocked.png" />
          </div>
        </div>
      )}
      {type === "maintenance" && (
        <div className={styles["error-wrapper"]}>
          <div className={styles["text-group"]}>
            <div className={styles.logo}>
              <img src="/images/error/img_logo.png" />
            </div>
            <div className={styles.title}>Under maintenance</div>
            {/*<p>HTTP ERROR 500</p>*/}
            {/*<Link href={"/"}>Go to Home</Link>*/}
          </div>
          <div className={styles.img}>
            <img src="/images/error/img_404.png" />
          </div>
        </div>
      )}
      {type === "comingsoon" && (
        <div className={styles["error-wrapper"]}>
          <div className={styles["text-group"]}>
            <div className={styles.logo}>
              <img src="/images/error/img_logo.png" />
            </div>
            <div className={styles.title}>{`We'll be back soon!`}</div>
            <p>
              {`Sorry for the inconvenience. We're performing scheduled maintenance.`}
            </p>
            <br />
            <p>We should be back online shortly.</p>
            {/*<p>HTTP ERROR 500</p>*/}
            {/*<Link href={"/"}>Go to Home</Link>*/}
          </div>
          <div className={styles.img}>
            <img src="/images/bonus/img_comingsoon.webp" />
          </div>
        </div>
      )}
    </>
  );
}
