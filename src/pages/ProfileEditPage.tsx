import { FormEvent, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { updateProfile } from "@/lib/api";
import styles from "@/app/profile-edit/page.module.css";

const GENDER_OPTIONS = [
  { value: "", label: "선택하세요" },
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
];

function generateYearOptions() {
  const current = new Date().getFullYear();
  const opts = [{ value: "", label: "년도" }];
  for (let y = current; y >= current - 100; y--) {
    opts.push({ value: String(y), label: `${y}년` });
  }
  return opts;
}

function generateMonthOptions() {
  const opts = [{ value: "", label: "월" }];
  for (let m = 1; m <= 12; m++) {
    opts.push({ value: String(m).padStart(2, "0"), label: `${m}월` });
  }
  return opts;
}

function generateDayOptions(year: string, month: string) {
  const opts = [{ value: "", label: "일" }];
  const maxDay =
    year && month ? new Date(Number(year), Number(month), 0).getDate() : 31;
  for (let d = 1; d <= maxDay; d++) {
    opts.push({ value: String(d).padStart(2, "0"), label: `${d}일` });
  }
  return opts;
}

export default function ProfileEditPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    height: "",
    weight: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      const [y, m, d] = user.birth_date.split("-");
      setForm({
        name: user.name,
        birthYear: y,
        birthMonth: m,
        birthDay: d,
        gender: user.gender,
        height: String(user.height),
        weight: String(user.weight),
      });
    }
  }, [user]);

  const yearOptions = useMemo(() => generateYearOptions(), []);
  const monthOptions = useMemo(() => generateMonthOptions(), []);
  const dayOptions = useMemo(
    () => generateDayOptions(form.birthYear, form.birthMonth),
    [form.birthYear, form.birthMonth]
  );

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.birthYear || !form.birthMonth || !form.birthDay) {
      setError("생년월일을 모두 선택해주세요.");
      return;
    }

    const birth_date = `${form.birthYear}-${form.birthMonth}-${form.birthDay}`;

    setSubmitting(true);
    try {
      await updateProfile({
        name: form.name,
        birth_date,
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
      });
      await refreshUser();
      setSuccess("회원 정보가 수정되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "회원 정보 수정에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <AuthGuard>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate("/profile")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          돌아가기
        </button>

        <h1 className={styles.title}>회원 정보 수정</h1>

        <Card>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

            <Input
              label="이름"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />

            <div>
              <div className={styles.fieldLabel}>생년월일</div>
              <div className={styles.row3}>
                <Select
                  options={yearOptions}
                  value={form.birthYear}
                  onChange={(e) => update("birthYear", e.target.value)}
                  required
                />
                <Select
                  options={monthOptions}
                  value={form.birthMonth}
                  onChange={(e) => update("birthMonth", e.target.value)}
                  required
                />
                <Select
                  options={dayOptions}
                  value={form.birthDay}
                  onChange={(e) => update("birthDay", e.target.value)}
                  required
                />
              </div>
            </div>

            <Select
              label="성별"
              options={GENDER_OPTIONS}
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              required
            />

            <div className={styles.row}>
              <Input
                label="키 (cm)"
                type="number"
                placeholder="170"
                value={form.height}
                onChange={(e) => update("height", e.target.value)}
                required
              />
              <Input
                label="몸무게 (kg)"
                type="number"
                placeholder="65"
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
                required
              />
            </div>

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? "저장 중..." : "저장"}
            </Button>
          </form>
        </Card>
      </div>
    </AuthGuard>
  );
}
