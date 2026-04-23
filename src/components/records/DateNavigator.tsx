"use client";

import { format, addDays, subDays, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import styles from "./DateNavigator.module.css";

interface DateNavigatorProps {
  date: Date;
  onChange: (date: Date) => void;
}

export default function DateNavigator({ date, onChange }: DateNavigatorProps) {
  const label = isToday(date)
    ? `오늘 (${format(date, "M월 d일", { locale: ko })})`
    : format(date, "yyyy년 M월 d일 (EEEE)", { locale: ko });

  return (
    <div className={styles.nav}>
      <button className={styles.arrowBtn} onClick={() => onChange(subDays(date, 1))}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className={styles.dateLabel}>{label}</span>
      <button className={styles.arrowBtn} onClick={() => onChange(addDays(date, 1))}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
