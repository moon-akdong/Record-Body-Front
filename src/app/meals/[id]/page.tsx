"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import { getMealById, deleteMeal } from "@/lib/api";
import { MealResponse } from "@/types/api";
import styles from "./page.module.css";

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식",
};

const MACRO_COLORS = {
  carbs: "#4CAF50",
  protein: "#2196F3",
  fat: "#FF9800",
};

function DonutChart({
  carbs,
  protein,
  fat,
}: {
  carbs: number;
  protein: number;
  fat: number;
}) {
  const total = carbs + protein + fat;
  if (total === 0) {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="60" fill="none" stroke="#E2EBE6" strokeWidth="20" />
      </svg>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const carbsRatio = carbs / total;
  const proteinRatio = protein / total;
  const fatRatio = fat / total;

  const carbsLength = carbsRatio * circumference;
  const proteinLength = proteinRatio * circumference;
  const fatLength = fatRatio * circumference;

  const carbsOffset = 0;
  const proteinOffset = -carbsLength;
  const fatOffset = -(carbsLength + proteinLength);

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle
        cx="80" cy="80" r={radius} fill="none"
        stroke={MACRO_COLORS.carbs} strokeWidth="20"
        strokeDasharray={`${carbsLength} ${circumference - carbsLength}`}
        strokeDashoffset={carbsOffset}
        transform="rotate(-90 80 80)"
      />
      <circle
        cx="80" cy="80" r={radius} fill="none"
        stroke={MACRO_COLORS.protein} strokeWidth="20"
        strokeDasharray={`${proteinLength} ${circumference - proteinLength}`}
        strokeDashoffset={proteinOffset}
        transform="rotate(-90 80 80)"
      />
      <circle
        cx="80" cy="80" r={radius} fill="none"
        stroke={MACRO_COLORS.fat} strokeWidth="20"
        strokeDasharray={`${fatLength} ${circumference - fatLength}`}
        strokeDashoffset={fatOffset}
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A2B23">
        {total.toFixed(0)}
      </text>
      <text x="80" y="96" textAnchor="middle" fontSize="12" fill="#6B7D74">
        g 합계
      </text>
    </svg>
  );
}

export default function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [meal, setMeal] = useState<MealResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMealById(Number(id))
      .then(setMeal)
      .catch((err) => setError(err instanceof Error ? err.message : "불러오기 실패"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!meal || !confirm("이 식사 기록을 삭제하시겠습니까?")) return;
    try {
      await deleteMeal(meal.id);
      router.push("/records");
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className={styles.loading}>불러오는 중...</div>
      </AuthGuard>
    );
  }

  if (error || !meal) {
    return (
      <AuthGuard>
        <div className={styles.container}>
          <div className={styles.error}>{error || "식사를 찾을 수 없습니다."}</div>
          <Link href="/records" className={styles.backLink}>
            기록 보기로 돌아가기
          </Link>
        </div>
      </AuthGuard>
    );
  }

  const totalCalories = meal.items.reduce((s, i) => s + i.calories, 0);
  const totalCarbs = meal.items.reduce((s, i) => s + i.carbs_g, 0);
  const totalProtein = meal.items.reduce((s, i) => s + i.protein_g, 0);
  const totalFat = meal.items.reduce((s, i) => s + i.fat_g, 0);
  const maxCalories = Math.max(...meal.items.map((i) => i.calories), 1);

  return (
    <AuthGuard>
      <div className={styles.container}>
        <Link href="/records" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          기록 보기
        </Link>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.mealType}>
              {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
            </h1>
            <span className={styles.dateTime}>
              {format(new Date(meal.eaten_at), "yyyy년 M월 d일 (EEE) HH:mm", { locale: ko })}
            </span>
          </div>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            삭제
          </button>
        </div>

        {/* Image */}
        {meal.image_url && (
          <div className={styles.imageSection}>
            <img src={meal.image_url} alt="음식 사진" className={styles.mealImage} />
          </div>
        )}

        {/* Summary */}
        <div className={styles.summaryGrid}>
          <Card className={styles.summaryCard}>
            <span className={styles.summaryLabel}>칼로리</span>
            <span className={styles.summaryValue}>
              {totalCalories}<span className={styles.summaryUnit}> kcal</span>
            </span>
          </Card>
          <Card className={styles.summaryCard}>
            <span className={styles.summaryLabel}>탄수화물</span>
            <span className={styles.summaryValue}>
              {totalCarbs}<span className={styles.summaryUnit}> g</span>
            </span>
          </Card>
          <Card className={styles.summaryCard}>
            <span className={styles.summaryLabel}>단백질</span>
            <span className={styles.summaryValue}>
              {totalProtein}<span className={styles.summaryUnit}> g</span>
            </span>
          </Card>
          <Card className={styles.summaryCard}>
            <span className={styles.summaryLabel}>지방</span>
            <span className={styles.summaryValue}>
              {totalFat}<span className={styles.summaryUnit}> g</span>
            </span>
          </Card>
        </div>

        {/* Donut Chart */}
        <Card className={styles.chartSection}>
          <div className={styles.chartTitle}>영양소 비율</div>
          <div className={styles.chartRow}>
            <div className={styles.donutWrapper}>
              <DonutChart carbs={totalCarbs} protein={totalProtein} fat={totalFat} />
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: MACRO_COLORS.carbs }} />
                <span className={styles.legendLabel}>탄수화물</span>
                <span className={styles.legendValue}>{totalCarbs}g</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: MACRO_COLORS.protein }} />
                <span className={styles.legendLabel}>단백질</span>
                <span className={styles.legendValue}>{totalProtein}g</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: MACRO_COLORS.fat }} />
                <span className={styles.legendLabel}>지방</span>
                <span className={styles.legendValue}>{totalFat}g</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Food Table */}
        <Card className={styles.tableSection}>
          <div className={styles.tableTitle}>음식 항목</div>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.colName}>음식명</span>
              <span className={styles.colNum}>양(g)</span>
              <span className={styles.colNum}>칼로리</span>
              <span className={styles.colNum}>탄수</span>
              <span className={styles.colNum}>단백</span>
              <span className={styles.colNum}>지방</span>
            </div>
            {meal.items.map((item) => (
              <div key={item.id} className={styles.tableRow}>
                <span className={styles.colName}>{item.food_name}</span>
                <span className={styles.colNum}>{item.amount_g}</span>
                <span className={styles.colNum}>{item.calories}</span>
                <span className={styles.colNum}>{item.carbs_g}</span>
                <span className={styles.colNum}>{item.protein_g}</span>
                <span className={styles.colNum}>{item.fat_g}</span>
              </div>
            ))}
            <div className={styles.totalRow}>
              <span className={styles.colName}>합계</span>
              <span className={styles.colNum}>{meal.items.reduce((s, i) => s + i.amount_g, 0)}</span>
              <span className={styles.colNum}>{totalCalories}</span>
              <span className={styles.colNum}>{totalCarbs}</span>
              <span className={styles.colNum}>{totalProtein}</span>
              <span className={styles.colNum}>{totalFat}</span>
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        {meal.items.length > 1 && (
          <Card className={styles.barSection}>
            <div className={styles.barTitle}>음식별 칼로리 비교</div>
            <div className={styles.barList}>
              {meal.items.map((item) => (
                <div key={item.id} className={styles.barItem}>
                  <span className={styles.barLabel}>{item.food_name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${(item.calories / maxCalories) * 100}%` }}
                    />
                  </div>
                  <span className={styles.barValue}>{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Memo */}
        {meal.memo && (
          <Card className={styles.memoSection}>
            <div className={styles.memoTitle}>메모</div>
            <div className={styles.memoContent}>{meal.memo}</div>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}
