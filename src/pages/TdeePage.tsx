import { FormEvent, useState } from "react";
import { format, subDays } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { getDailyTdee } from "@/lib/api";
import { DailyTdee } from "@/types/api";
import styles from "@/app/tdee/page.module.css";

const ACTIVITY_OPTIONS = [
  { value: "", label: "선택하세요" },
  { value: "SEDENTARY", label: "비활동적 (운동 거의 안 함)" },
  { value: "LIGHT", label: "가벼운 활동 (주 1-3회)" },
  { value: "MODERATE", label: "보통 활동 (주 3-5회)" },
  { value: "ACTIVE", label: "활발한 활동 (주 6-7회)" },
  { value: "VERY_ACTIVE", label: "매우 활발 (운동선수 수준)" },
];

export default function TdeePage() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  const weekAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [activityLevel, setActivityLevel] = useState("");
  const [result, setResult] = useState<[string, DailyTdee][] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!activityLevel) {
      setError("활동 수준을 선택해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      setError("기간을 모두 입력해주세요.");
      return;
    }
    if (startDate > endDate) {
      setError("시작일이 종료일보다 클 수 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const data = await getDailyTdee({
        activity_level: activityLevel,
        start_date: `${startDate}T00:00:00`,
        end_date: `${endDate}T23:59:59`,
      });

      const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
      setResult(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "TDEE 분석에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const totalDays = result?.length ?? 0;
  const avgTdeeInfo =
    totalDays > 0
      ? result!.reduce((sum, [, d]) => sum + d.tdee_info, 0) / totalDays
      : 0;
  const maxAbsValue =
    totalDays > 0
      ? Math.max(...result!.map(([, d]) => Math.abs(d.tdee_info)), 1)
      : 1;

  if (!user) return null;

  return (
    <AuthGuard>
      <div className={styles.container}>
        <h1 className={styles.title}>TDEE 분석</h1>

        <Card>
          <form className={styles.inputSection} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}

            <div className={styles.dateRow}>
              <Input
                label="시작일"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                required
              />
              <span className={styles.dateSeparator}>~</span>
              <Input
                label="종료일"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={today}
                required
              />
            </div>

            <Select
              label="활동 수준"
              options={ACTIVITY_OPTIONS}
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              required
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "분석 중..." : "분석하기"}
            </Button>
          </form>
        </Card>

        {result && result.length === 0 && (
          <div className={styles.emptyMsg}>
            선택한 기간에 식사 기록이 없습니다.
          </div>
        )}

        {result && result.length > 0 && (
          <>
            <div className={styles.summaryGrid}>
              <Card className={styles.summaryCard}>
                <span className={styles.summaryValue}>{totalDays}</span>
                <span className={styles.summaryLabel}>분석 일수</span>
              </Card>
              <Card className={styles.summaryCard}>
                <span
                  className={`${styles.summaryValue} ${
                    avgTdeeInfo > 0 ? styles.surplus : avgTdeeInfo < 0 ? styles.deficit : ""
                  }`}
                >
                  {avgTdeeInfo > 0 ? "+" : ""}
                  {Math.round(avgTdeeInfo)}
                </span>
                <span className={styles.summaryLabel}>평균 잉여/부족 (kcal)</span>
              </Card>
            </div>

            <div>
              <div className={styles.sectionTitle}>일별 상세</div>
              <Card>
                <div className={styles.dailyList}>
                  {result.map(([key, day]) => {
                    const dateStr = day.date.split("T")[0];
                    const isSurplus = day.tdee_info > 0;
                    const barPercent = Math.min(
                      (Math.abs(day.tdee_info) / maxAbsValue) * 100,
                      100
                    );

                    return (
                      <div key={key} className={styles.dailyRow}>
                        <span className={styles.dailyDate}>{dateStr}</span>
                        <div className={styles.barWrapper}>
                          <div className={styles.bar}>
                            <div
                              className={`${styles.barFill} ${
                                isSurplus ? styles.surplus : styles.deficit
                              }`}
                              style={{ width: `${barPercent}%` }}
                            />
                          </div>
                          <span className={styles.dailyMessage}>{day.message}</span>
                        </div>
                        <span
                          className={`${styles.dailyValue} ${
                            isSurplus ? styles.surplus : styles.deficit
                          }`}
                        >
                          {isSurplus ? "+" : ""}
                          {Math.round(day.tdee_info)} kcal
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}
