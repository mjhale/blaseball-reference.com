import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <>
      <header>
        <h1 className={styles.logo}>
          Blaseball <span className={styles.hasSmallText}>Reference</span>
        </h1>
        <p style={{ textAlign: "center" }}>Coming soon.</p>
      </header>
      <p>
        Visit{" "}
        <a href="https://dev.blaseball-reference.com" className={styles.link}>
          dev.blaseball-reference.com
        </a>{" "}
        to view the latest updates.
      </p>
    </>
  );
}
