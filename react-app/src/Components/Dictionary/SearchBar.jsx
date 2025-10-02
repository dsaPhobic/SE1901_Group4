import React from "react";
import { Search } from "lucide-react";
import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange, onSubmit, placeholder }) {
  return (
    <form className={styles.searchBar} onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        <Search size={16} /> Search
      </button>
    </form>
  );
}
