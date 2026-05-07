import { FormEvent, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import ComboBox from "@/components/ui/ComboBox";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ImageUploader from "@/components/meal/ImageUploader";
import MealItemRow from "@/components/meal/MealItemRow";
import { createMeal, uploadImage, getSubCategories } from "@/lib/api";
import { MealItem } from "@/types/api";
import styles from "@/app/meals/new/page.module.css";

const MEAL_TYPE_OPTIONS = [
  { value: "breakfast", label: "아침" },
  { value: "lunch", label: "점심" },
  { value: "dinner", label: "저녁" },
  { value: "snack", label: "간식" },
  { value: "night", label: "야식" },
];

const AMPM_OPTIONS = [
  { value: "AM", label: "오전" },
  { value: "PM", label: "오후" },
];

function generateHour12Options() {
  return [
    { value: "12", label: "12시" },
    ...Array.from({ length: 11 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}시`,
    })),
  ];
}

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

function generateMinuteOptions() {
  const opts = [];
  for (let m = 0; m < 60; m += 5) {
    opts.push({ value: String(m).padStart(2, "0"), label: `${m}분` });
  }
  return opts;
}

function emptyItem(): MealItem {
  return { food_name_kr: "", amount_g: 0, category: "" };
}

function getNow() {
  const now = new Date();
  const h = now.getHours();
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, "0"),
    day: String(now.getDate()).padStart(2, "0"),
    ampm: h < 12 ? "AM" : "PM",
    hour12: String(h === 0 ? 12 : h > 12 ? h - 12 : h),
    minute: String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, "0"),
  };
}

export default function NewMealPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mealType, setMealType] = useState("lunch");
  const [dateTime, setDateTime] = useState(getNow);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
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
  const hour12Options = useMemo(() => generateHour12Options(), []);
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

  function handleFileSelect(file: File | null) {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  }

  function resetForm() {
    setMealType("lunch");
    setDateTime(getNow());
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview("");
    setMemo("");
    setItems([emptyItem()]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    let hour24 = Number(dateTime.hour12);
    if (dateTime.ampm === "AM") {
      hour24 = hour24 === 12 ? 0 : hour24;
    } else {
      hour24 = hour24 === 12 ? 12 : hour24 + 12;
    }
    const minuteVal = Math.min(59, Math.max(0, Number(dateTime.minute) || 0));

    const eatenAt = new Date(
      Number(dateTime.year),
      Number(dateTime.month) - 1,
      Number(dateTime.day),
      hour24,
      minuteVal
    ).toISOString();

    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const res = await uploadImage(imageFile);
        imageUrl = res.image_url;
      }

      const payload = {
        meal_type: mealType,
        eaten_at: eatenAt,
        image_url: imageUrl || "",
        note: memo,
        items,
      };
      console.log("createMeal payload:", JSON.stringify(payload, null, 2));
      await createMeal(payload);
      navigate("/records");
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
                <ImageUploader previewUrl={imagePreview} onFileSelect={handleFileSelect} />
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
                  <ComboBox
                    label="식사 유형"
                    placeholder="유형 선택 또는 입력"
                    options={MEAL_TYPE_OPTIONS}
                    value={mealType}
                    onChange={setMealType}
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
                    options={AMPM_OPTIONS}
                    value={dateTime.ampm}
                    onChange={(e) => updateDateTime("ampm", e.target.value)}
                  />
                  <Select
                    options={hour12Options}
                    value={dateTime.hour12}
                    onChange={(e) => updateDateTime("hour12", e.target.value)}
                  />
                  <ComboBox
                    placeholder="분"
                    options={minuteOptions}
                    value={dateTime.minute}
                    onChange={(v) => updateDateTime("minute", v)}
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
