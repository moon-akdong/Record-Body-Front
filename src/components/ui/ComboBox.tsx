"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ComboBox.module.css";

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function ComboBox({ label, placeholder, value, options, onChange }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = value
    ? options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className={styles.dropdown}>
          {filtered.map((opt) => (
            <div
              key={opt}
              className={styles.option}
              onMouseDown={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
