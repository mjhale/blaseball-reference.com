import Navigation from "components/Navigation";

import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <Navigation />

          {children}
        </div>
      </main>
    </>
  );
}
