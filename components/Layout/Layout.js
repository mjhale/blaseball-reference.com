import styles from "./Layout.module.css";

import Navigation from "components/Navigation";
import { SkipNavContent } from "@reach/skip-nav";

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <SkipNavContent />
        <div className="container">{children}</div>
      </main>
    </>
  );
}
