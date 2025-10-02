import React from "react";
import { Search } from "lucide-react";
import styles from "./search.module.css";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  showButton = true, 
}) {
  return (
    <form className={styles.searchBar} onSubmit={onSubmit}>
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.input}
      />
      {showButton && (
        <button type="submit" className={styles.button}>
          <Search size={16} /> Search
        </button>
      )}
    </form>
  );
}
