import styles from "./Navigation.module.css";

export default function Navigation() {
  return (
    <header>
      <h1 className={styles.logo}>
        Blaseball <span className={styles.hasSmallText}>Reference</span>
      </h1>
    </header>
  );
}
