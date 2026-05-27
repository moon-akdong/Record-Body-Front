import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { startOfDay, format } from "date-fns";
import AuthGuard from "@/components/layout/AuthGuard";
import DateNavigator from "@/components/records/DateNavigator";
import DailySummary from "@/components/records/DailySummary";
import MealCard from "@/components/records/MealCard";
import TdeeComparison from "@/components/records/TdeeComparison";
import { getMealsByDate, getRecordDates } from "@/lib/api";
import { MealResponse } from "@/types/api";
import styles from "@/app/records/page.module.css";

export default function RecordsPage() {
  const location = useLocation();
  const [date, setDate] = useState(() => startOfDay(new Date()));
  const [meals, setMeals] = useState<MealResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(!!(location.state as { saving?: boolean })?.saving);
  const [recordDates, setRecordDates] = useState<Set<string>>(new Set());

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMealsByDate(date);
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "기록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  const fetchRecordDates = useCallback(async (year: number, month: number) => {
    try {
      const dates = await getRecordDates(year, month);
      setRecordDates(new Set(dates));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  useEffect(() => {
    fetchRecordDates(date.getFullYear(), date.getMonth() + 1);
  }, [date, fetchRecordDates]);

  useEffect(() => {
    if (!saving) return;

    const onSaved = () => {
      setSaving(false);
      fetchMeals();
      fetchRecordDates(date.getFullYear(), date.getMonth() + 1);
    };
    const onError = (e: Event) => {
      setSaving(false);
      setError((e as CustomEvent).detail);
    };

    window.addEventListener("meal-saved", onSaved);
    window.addEventListener("meal-save-error", onError);
    return () => {
      window.removeEventListener("meal-saved", onSaved);
      window.removeEventListener("meal-save-error", onError);
    };
  }, [saving, fetchMeals, fetchRecordDates, date]);

  return (
    <AuthGuard>
      <div className={styles.container}>
        <h1 className={styles.title}>기록 보기</h1>

        {saving && (
          <div className={styles.savingBanner}>식사를 등록하고 있습니다...</div>
        )}

        <DateNavigator
          date={date}
          onChange={(d) => setDate(startOfDay(d))}
          recordDates={recordDates}
          onMonthChange={fetchRecordDates}
        />

        {loading ? (
          <div className={styles.loading}>불러오는 중...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : meals.length === 0 ? (
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 14h6M9 18h6" />
            </svg>
            <p>이 날짜에 기록된 식사가 없습니다.</p>
          </div>
        ) : (
          <>
            <DailySummary meals={meals} />
            <TdeeComparison date={date} hasMeals={meals.length > 0} />
            <div className={styles.meals}>
              {meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onDeleted={fetchMeals} />
              ))}
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
