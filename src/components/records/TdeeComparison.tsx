import { useCallback, useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { getOneDayTdee } from "@/lib/api";
import { OneDayTdeeResponse } from "@/types/api";
import styles from "./TdeeComparison.module.css";

const LEVEL_LABELS: { key: keyof OneDayTdeeResponse["levels"]; label: string }[] = [
  { key: "sedentary", label: "비활동적 (운동 거의 안 함)" },
  { key: "light", label: "가벼운 활동 (주 1-3회)" },
  { key: "moderate", label: "보통 활동 (주 3-5회)" },
  { key: "active", label: "활발한 활동 (주 6-7회)" },
  { key: "very_active", label: "매우 활발 (운동선수 수준)" },
];

interface TdeeComparisonProps {
  date: Date;
  hasMeals: boolean;
}

export default function TdeeComparison({ date, hasMeals }: TdeeComparisonProps) {
  const [data, setData] = useState<OneDayTdeeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTdee = useCallback(async () => {
    if (!hasMeals) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const res = await getOneDayTdee(date);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [date, hasMeals]);

  useEffect(() => {
    fetchTdee();
  }, [fetchTdee]);

  if (!hasMeals || loading || !data) return null;

  const maxAbs = Math.max(
    ...LEVEL_LABELS.map((l) => Math.abs(data.levels[l.key])),
    1
  );

  return (
    <div>
      <div className={styles.sectionTitle}>오늘의 칼로리 vs TDEE</div>
      <Card>
        <div className={styles.intakeHeader}>
          총 섭취 <strong>{data.total_calories.toLocaleString()} kcal</strong>
        </div>
        <div className={styles.levelList}>
          {LEVEL_LABELS.map(({ key, label }) => {
            const diff = data.levels[key];
            const isSurplus = diff > 0;
            const barPercent = Math.min((Math.abs(diff) / maxAbs) * 100, 100);

            return (
              <div key={key} className={styles.levelRow}>
                <span className={styles.levelLabel}>{label}</span>
                <div className={styles.barArea}>
                  <div className={styles.bar}>
                    <div
                      className={`${styles.barFill} ${isSurplus ? styles.surplus : styles.deficit}`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
                <span className={`${styles.levelValue} ${isSurplus ? styles.surplus : styles.deficit}`}>
                  {isSurplus ? "+" : ""}{diff} kcal
                </span>
              </div>
            );
          })}
        </div>
        {data.message && (
          <div className={styles.messageFooter}>{data.message}</div>
        )}
      </Card>
    </div>
  );
}
