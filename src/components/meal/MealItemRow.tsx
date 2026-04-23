"use client";

import Input from "@/components/ui/Input";
import ComboBox from "@/components/ui/ComboBox";
import { MealItem } from "@/types/api";
import styles from "./MealItemRow.module.css";

interface MealItemRowProps {
  item: MealItem;
  index: number;
  categories: string[];
  onChange: (index: number, field: keyof MealItem, value: string | number) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export default function MealItemRow({
  item,
  index,
  categories,
  onChange,
  onRemove,
  canRemove,
}: MealItemRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.categoryField}>
        <ComboBox
          label={index === 0 ? "카테고리" : undefined}
          placeholder="카테고리 선택/입력"
          value={item.category}
          options={categories}
          onChange={(v) => onChange(index, "category", v)}
        />
      </div>
      <div className={styles.nameField}>
        <Input
          label={index === 0 ? "음식명" : undefined}
          placeholder="음식 이름"
          value={item.food_name}
          onChange={(e) => onChange(index, "food_name", e.target.value)}
          required
        />
      </div>
      <Input
        label={index === 0 ? "양(g)" : undefined}
        type="number"
        placeholder="100"
        value={item.amount_g || ""}
        onChange={(e) => onChange(index, "amount_g", Number(e.target.value))}
        required
      />
      <button
        type="button"
        className={styles.removeBtn}
        onClick={() => onRemove(index)}
        disabled={!canRemove}
        title="삭제"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
