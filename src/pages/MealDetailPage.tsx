import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import { getMealById, deleteMeal } from "@/lib/api";
import { MealResponse } from "@/types/api";
import styles from "@/app/meals/[id]/page.module.css";

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식",
  night: "야식",
};

const MACRO_COLORS = {
  carbs: "#4CAF50",
  protein: "#2196F3",
  fat: "#FF9800",
  sugar: "#c12727"
};

function DonutChart({
  carbs,
  protein,
  fat,
  sugar,
}: {
  carbs: number;
  protein: number;
  fat: number;
  sugar: number;
}) {
  const total = carbs + protein + fat + sugar;
  if (total === 0) {
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="60" fill="none" stroke="#E2EBE6" strokeWidth="20" />
      </svg>
    );
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { color: MACRO_COLORS.carbs, value: carbs },
    { color: MACRO_COLORS.protein, value: protein },
    { color: MACRO_COLORS.fat, value: fat },
    { color: MACRO_COLORS.sugar, value: sugar },
  ];

  let accumulated = 0;

  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {segments.map((seg, i) => {
        const length = (seg.value / total) * circumference;
        const offset = -accumulated;
        accumulated += length;
        return (
          <circle
            key={i}
            cx="80" cy="80" r={radius} fill="none"
            stroke={seg.color} strokeWidth="20"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={offset}
            transform="rotate(-90 80 80)"
          />
        );
      })}
      <text x="80" y="76" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1A2B23">
        {total.toFixed(0)}
      </text>
      <text x="80" y="96" textAnchor="middle" fontSize="12" fill="#6B7D74">
        g 합계
      </text>
    </svg>
  );
}

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<MealResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(false);

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
      navigate("/records");
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
          <Link to="/records" className={styles.backLink}>
            기록 보기로 돌아가기
          </Link>
        </div>
      </AuthGuard>
    );
  }

  const totalCalories = meal.total_calories;
  const totalCarbs = meal.total_carb;
  const totalProtein = meal.total_protein;
  const totalFat = meal.total_fat;
  const totalSugar = meal.total_sugar;
  const maxCalories = Math.max(...meal.items.map((i) => i.calories), 1);

  return (
    <AuthGuard>
      <div className={styles.container}>
        <Link to="/records" className={styles.backLink}>
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
            <img
              src={meal.image_url}
              alt="음식 사진"
              className={styles.mealImage}
              onClick={() => setLightbox(true)}
            />
          </div>
        )}

        {/* Lightbox */}
        {lightbox && meal.image_url && (
          <div className={styles.lightbox} onClick={() => setLightbox(false)}>
            <img src={meal.image_url} alt="원본 사진" className={styles.lightboxImage} />
          </div>
        )}

        {/* Summary */}
        <div className={styles.summaryGrid}>
          <Card className={`${styles.summaryCard} ${styles.summaryHighlight}`}>
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
          <Card className={styles.summaryCard}>
            <span className={styles.summaryLabel}>당류</span>
            <span className={styles.summaryValue}>
              {totalSugar}<span className={styles.summaryUnit}> g</span>
            </span>
          </Card>
        </div>

        {/* Donut Chart */}
        <Card className={styles.chartSection}>
          <div className={styles.chartTitle}>영양소 비율</div>
          <div className={styles.chartRow}>
            <div className={styles.donutWrapper}>
              <DonutChart carbs={totalCarbs} protein={totalProtein} fat={totalFat} sugar={totalSugar} />
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
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ backgroundColor: MACRO_COLORS.sugar }} />
                <span className={styles.legendLabel}>당류</span>
                <span className={styles.legendValue}>{totalSugar}g</span>
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
              <span className={styles.colNum}>탄수화물</span>
              <span className={styles.colNum}>단백질</span>
              <span className={styles.colNum}>지방</span>
              <span className={styles.colNum}>당류</span>
            </div>
            {meal.items.map((item, idx) => (
              <div key={idx} className={styles.tableRow}>
                <span className={styles.colName}>{item.name}</span>
                <span className={styles.colNum}>{item.amount_g}</span>
                <span className={styles.colNum}>{item.calories}</span>
                <span className={styles.colNum}>{item.carb}</span>
                <span className={styles.colNum}>{item.protein}</span>
                <span className={styles.colNum}>{item.fat}</span>
                <span className={styles.colNum}>{item.sugar}</span>
              </div>
            ))}
            <div className={styles.totalRow}>
              <span className={styles.colName}>합계</span>
              <span className={styles.colNum}>{meal.items.reduce((s, i) => s + i.amount_g, 0)}</span>
              <span className={styles.colNum}>{totalCalories}</span>
              <span className={styles.colNum}>{totalCarbs}</span>
              <span className={styles.colNum}>{totalProtein}</span>
              <span className={styles.colNum}>{totalFat}</span>
              <span className={styles.colNum}>{totalSugar}</span>
            </div>
          </div>
        </Card>

        {/* Bar Chart */}
        {meal.items.length > 1 && (
          <Card className={styles.barSection}>
            <div className={styles.barTitle}>음식별 칼로리 비교</div>
            <div className={styles.barList}>
              {meal.items.map((item, idx) => (
                <div key={idx} className={styles.barItem}>
                  <span className={styles.barLabel}>{item.name}</span>
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
        {meal.note && (
          <Card className={styles.memoSection}>
            <div className={styles.memoTitle}>메모</div>
            <div className={styles.memoContent}>{meal.note}</div>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}
