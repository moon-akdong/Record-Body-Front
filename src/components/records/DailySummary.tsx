"use client";

import { MealResponse } from "@/types/api";
import styles from "./DailySummary.module.css";

interface DailySummaryProps {
  meals: MealResponse[];
}

export default function DailySummary({ meals }: DailySummaryProps) {
  const totals = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.calories += item.calories;
        acc.carbs += item.carbs_g;
        acc.protein += item.protein_g;
        acc.fat += item.fat_g;
        acc.amount += item.amount_g;
      });
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, amount: 0 }
  );

  const stats = [
    { label: "칼로리", value: `${Math.round(totals.calories)}`, unit: "kcal", highlight: true },
    { label: "탄수화물", value: `${Math.round(totals.carbs)}`, unit: "g" },
    { label: "단백질", value: `${Math.round(totals.protein)}`, unit: "g" },
    { label: "지방", value: `${Math.round(totals.fat)}`, unit: "g" },
    { label: "총 섭취량", value: `${Math.round(totals.amount)}`, unit: "g" },
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
