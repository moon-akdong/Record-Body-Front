import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";
import styles from "./DateNavigator.module.css";

interface DateNavigatorProps {
  date: Date;
  onChange: (date: Date) => void;
  recordDates?: Set<string>;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function DateNavigator({ date, onChange, recordDates }: DateNavigatorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(date));

  const label = isToday(date)
    ? `오늘 (${format(date, "M월 d일", { locale: ko })})`
    : format(date, "yyyy년 M월 d일 (EEEE)", { locale: ko });

  function handleDateClick(d: Date) {
    onChange(d);
    setCalendarOpen(false);
  }

  function toggleCalendar() {
    if (!calendarOpen) {
      setViewMonth(startOfMonth(date));
    }
    setCalendarOpen(!calendarOpen);
  }

  // Generate calendar grid
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const weeks: Date[][] = [];
  let day = calStart;
  while (day <= calEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  function hasRecord(d: Date): boolean {
    if (!recordDates) return false;
    const key = format(d, "yyyy-MM-dd");
    return recordDates.has(key);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        <button className={styles.dateLabel} onClick={toggleCalendar}>
          {label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
            <path d={calendarOpen ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
      </div>

      {calendarOpen && (
        <div className={styles.calendar}>
          <div className={styles.calHeader}>
            <button className={styles.calArrow} onClick={() => setViewMonth(subMonths(viewMonth, 1))}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className={styles.calMonth}>{format(viewMonth, "yyyy년 M월")}</span>
            <button className={styles.calArrow} onClick={() => setViewMonth(addMonths(viewMonth, 1))}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>{w}</span>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className={styles.week}>
              {week.map((d) => {
                const inMonth = isSameMonth(d, viewMonth);
                const selected = isSameDay(d, date);
                const today = isToday(d);
                const record = hasRecord(d);
                return (
                  <button
                    key={d.toISOString()}
                    className={`${styles.day} ${!inMonth ? styles.dayOutside : ""} ${selected ? styles.daySelected : ""} ${today ? styles.dayToday : ""}`}
                    onClick={() => handleDateClick(d)}
                  >
                    {format(d, "d")}
                    {record && <span className={styles.dot} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
