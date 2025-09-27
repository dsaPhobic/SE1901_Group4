import React from "react";
import styles from "./InputField.module.css";

const InputField = ({ icon, type="text", placeholder, name, value, onChange }) => {
  return (
    <div className={styles.formGroup}>
      <div className={styles.inputWrapper}>
        <img src={icon} alt="" className={styles.inputIcon} />
        <input
          className={styles.input}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default InputField;
