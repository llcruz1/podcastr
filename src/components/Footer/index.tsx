import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";

function Footer() {
  return (
    <header className={styles.footerContainer}>
      <Link href={"https://www.listennotes.com/api/"}>
        <a>
          <Image
            width={200}
            height={17}
            src="/api-logo.png"
            alt="Listen Notes API"
            objectFit="cover"
          />
        </a>
      </Link>
    </header>
  );
}

export default Footer;
