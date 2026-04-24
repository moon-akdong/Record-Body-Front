"use client";

import Link from "next/link";
import { format } from "date-fns";
import Card from "@/components/ui/Card";
import { MealResponse } from "@/types/api";
import { deleteMeal } from "@/lib/api";
import styles from "./MealCard.module.css";

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식",
};

interface MealCardProps {
  meal: MealResponse;
  onDeleted: () => void;
}

export default function MealCard({ meal, onDeleted }: MealCardProps) {
  async function handleDelete() {
    if (!confirm("이 식사 기록을 삭제하시겠습니까?")) return;
    try {
      await deleteMeal(meal.id);
      onDeleted();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <span className={styles.mealType}>
          {MEAL_TYPE_LABELS[meal.meal_type] || meal.meal_type}
        </span>
        <span className={styles.time}>
          {format(new Date(meal.eaten_at), "HH:mm")}
        </span>
      </div>

      <div className={styles.body}>
        {meal.image_url ? (
          <img src={meal.image_url} alt="음식 사진" className={styles.thumbnail} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.nutrients}>
            <div className={styles.nutrientMain}>
              <span className={styles.nutrientValue}>{Math.round(meal.total_calories)}</span>
              <span className={styles.nutrientUnit}>kcal</span>
            </div>
            <div className={styles.nutrientRow}>
              <span className={styles.nutrientItem}>탄수 {Math.round(meal.total_carb)}g</span>
              <span className={styles.nutrientItem}>단백 {Math.round(meal.total_protein)}g</span>
              <span className={styles.nutrientItem}>지방 {Math.round(meal.total_fat)}g</span>
              <span className={styles.nutrientItem}>당류 {Math.round(meal.total_sugar)}g</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {meal.note ? (
          <div className={styles.memo}>
            <svg className={styles.memoIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
            {meal.note}
          </div>
        ) : (
          <div />
        )}
        <div className={styles.footerActions}>
          <Link href={`/meals/${meal.id}`} className={styles.detailLink}>
            상세보기
          </Link>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </Card>
  );
}
