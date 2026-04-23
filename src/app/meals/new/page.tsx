"use client";

import { FormEvent, useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/meal/ImageUploader";
import MealItemRow from "@/components/meal/MealItemRow";
import { createMeal, getSubCategories } from "@/lib/api";
import { MealItem } from "@/types/api";
import styles from "./page.module.css";

const MEAL_TYPE_OPTIONS = [
  { value: "breakfast", label: "아침" },
  { value: "lunch", label: "점심" },
  { value: "dinner", label: "저녁" },
  { value: "snack", label: "간식" },
];

function generateYearOptions() {
  const current = new Date().getFullYear();
  const opts = [];
  for (let y = current; y >= current - 5; y--) {
    opts.push({ value: String(y), label: `${y}년` });
  }
  return opts;
}

function generateMonthOptions() {
  const opts = [];
  for (let m = 1; m <= 12; m++) {
    opts.push({ value: String(m).padStart(2, "0"), label: `${m}월` });
  }
  return opts;
}

function generateDayOptions(year: string, month: string) {
  const maxDay = year && month
    ? new Date(Number(year), Number(month), 0).getDate()
    : 31;
  const opts = [];
  for (let d = 1; d <= maxDay; d++) {
    opts.push({ value: String(d).padStart(2, "0"), label: `${d}일` });
  }
  return opts;
}

function generateHourOptions() {
  const opts = [];
  for (let h = 0; h < 24; h++) {
    const label = h < 12 ? `오전 ${h === 0 ? 12 : h}시` : `오후 ${h === 12 ? 12 : h - 12}시`;
    opts.push({ value: String(h).padStart(2, "0"), label });
  }
  return opts;
}

function generateMinuteOptions() {
  const opts = [];
  for (let m = 0; m < 60; m += 5) {
    opts.push({ value: String(m).padStart(2, "0"), label: `${m}분` });
  }
  return opts;
}

function emptyItem(): MealItem {
  return { food_name: "", amount_g: 0, category: "", calories: 0, carbs_g: 0, protein_g: 0, fat_g: 0 };
}

function getNow() {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    day: String(now.getDate()).padStart(2, "0"),
    hour: String(now.getHours()).padStart(2, "0"),
    minute: String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, "0"),
  };
}

export default function MealNewPage() {
  const { user } = useAuth();
  const [mealType, setMealType] = useState("lunch");
  const [dateTime, setDateTime] = useState(getNow);
  const [imageUrl, setImageUrl] = useState("");
  const [items, setItems] = useState<MealItem[]>([emptyItem()]);
  const [memo, setMemo] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const yearOptions = useMemo(() => generateYearOptions(), []);
  const monthOptions = useMemo(() => generateMonthOptions(), []);
  const dayOptions = useMemo(
    () => generateDayOptions(dateTime.year, dateTime.month),
    [dateTime.year, dateTime.month]
  );
  const hourOptions = useMemo(() => generateHourOptions(), []);
  const minuteOptions = useMemo(() => generateMinuteOptions(), []);

  function updateDateTime(field: string, value: string) {
    setDateTime((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    getSubCategories().then(setCategories).catch(() => {});
  }, []);

  function handleItemChange(index: number, field: keyof MealItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function resetForm() {
    setMealType("lunch");
    setDateTime(getNow());
    setImageUrl("");
    setMemo("");
    setItems([emptyItem()]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const eatenAt = new Date(
      Number(dateTime.year),
      Number(dateTime.month) - 1,
      Number(dateTime.day),
      Number(dateTime.hour),
      Number(dateTime.minute)
    ).toISOString();

    try {
      await createMeal({
        meal_type: mealType,
        eaten_at: eatenAt,
        image_url: imageUrl || undefined,
        memo: memo || undefined,
        items,
      });
      setSuccess("식사가 성공적으로 등록되었습니다!");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {user?.name}님, 오늘 뭘 드셨나요?
        </h1>

        {success && <div className={styles.successMsg}>{success}</div>}
        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.left}>
              <Card>
                <div className={styles.sectionLabel}>음식 사진</div>
                <ImageUploader imageUrl={imageUrl} onUploaded={setImageUrl} />
              </Card>

              <Card>
                <div className={styles.sectionLabel}>메모 (선택)</div>
                <textarea
                  className={styles.memoInput}
                  placeholder="식사에 대한 메모를 남겨보세요"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={3}
                />
              </Card>
            </div>

            <div className={styles.right}>
              <Card>
                <div className={styles.sectionLabel}>식사 정보</div>
                <div className={styles.mealMeta}>
                  <Select
                    label="식사 유형"
                    options={MEAL_TYPE_OPTIONS}
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                  />
                </div>
                <div className={styles.dateTimeLabel}>식사 날짜</div>
                <div className={styles.dateRow}>
                  <Select
                    options={yearOptions}
                    value={dateTime.year}
                    onChange={(e) => updateDateTime("year", e.target.value)}
                  />
                  <Select
                    options={monthOptions}
                    value={dateTime.month}
                    onChange={(e) => updateDateTime("month", e.target.value)}
                  />
                  <Select
                    options={dayOptions}
                    value={dateTime.day}
                    onChange={(e) => updateDateTime("day", e.target.value)}
                  />
                </div>
                <div className={styles.dateTimeLabel}>식사 시간</div>
                <div className={styles.timeRow}>
                  <Select
                    options={hourOptions}
                    value={dateTime.hour}
                    onChange={(e) => updateDateTime("hour", e.target.value)}
                  />
                  <Select
                    options={minuteOptions}
                    value={dateTime.minute}
                    onChange={(e) => updateDateTime("minute", e.target.value)}
                  />
                </div>
              </Card>

              <Card>
                <div className={styles.sectionLabel}>음식 항목</div>
                <div className={styles.items}>
                  {items.map((item, i) => (
                    <MealItemRow
                      key={i}
                      item={item}
                      index={i}
                      categories={categories}
                      onChange={handleItemChange}
                      onRemove={removeItem}
                      canRemove={items.length > 1}
                    />
                  ))}
                </div>
                <button type="button" className={styles.addBtn} onClick={addItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  음식 추가
                </button>
              </Card>

              <div className={styles.actions}>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "등록 중..." : "식사 등록"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  초기화
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
