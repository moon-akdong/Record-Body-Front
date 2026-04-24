"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ComboBox.module.css";

interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: string[] | ComboBoxOption[];
  onChange: (value: string) => void;
}

function normalizeOptions(options: string[] | ComboBoxOption[]): ComboBoxOption[] {
  if (!options || options.length === 0) return [];
  return options
    .filter((o) => o != null)
    .map((o) => (typeof o === "string" ? { value: o, label: o } : o));
}

export default function ComboBox({ label, placeholder, value, options, onChange }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const normalized = normalizeOptions(options);

  // Sync inputText with value from outside
  useEffect(() => {
    if (normalized.length === 0) {
      setInputText(value);
      return;
    }
    const match = normalized.find((o) => o.value === value);
    setInputText(match ? match.label : value);
  }, [value]);

  const filtered = inputText
    ? normalized.filter((opt) => opt.label.toLowerCase().includes(inputText.toLowerCase()))
    : normalized;

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
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div className={styles.dropdown}>
          {filtered.map((opt) => (
            <div
              key={opt.value}
              className={styles.option}
              onMouseDown={() => {
                onChange(opt.value);
                setInputText(opt.label);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
