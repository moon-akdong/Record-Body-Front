"use client";

import { MealResponse } from "@/types/api";
import styles from "./DailySummary.module.css";

interface DailySummaryProps {
  meals: MealResponse[];
}

export default function DailySummary({ meals }: DailySummaryProps) {
  const totals = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.total_calories;
      acc.carbs += meal.total_carb;
      acc.protein += meal.total_protein;
      acc.fat += meal.total_fat;
      acc.sugar += meal.total_sugar;
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0 }
  );

  const stats = [
    { label: "칼로리", value: `${Math.round(totals.calories)}`, unit: "kcal", highlight: true },
    { label: "탄수화물", value: `${Math.round(totals.carbs)}`, unit: "g" },
    { label: "단백질", value: `${Math.round(totals.protein)}`, unit: "g" },
    { label: "지방", value: `${Math.round(totals.fat)}`, unit: "g" },
    { label: "당류", value: `${Math.round(totals.sugar)}`, unit: "g" },
  ];

  return (
    <div className={styles.summary}>
      {stats.map((s) => (
        <div key={s.label} className={`${styles.stat} ${s.highlight ? styles.highlight : ""}`}>
          <span className={styles.statValue}>
            {s.value}
            <span style={{ fontSize: 12, fontWeight: 400 }}>{s.unit}</span>
          </span>
          <span className={styles.statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
