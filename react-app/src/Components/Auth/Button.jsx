import styles from "./Button.module.css";

export default function Button({ children, onClick, type = "button", variant = "yellow" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
