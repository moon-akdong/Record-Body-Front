"use client";

import { FormEvent, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GuestGuard from "@/components/layout/GuestGuard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { register } from "@/lib/api";
import styles from "./page.module.css";

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
  const maxDay = year && month
    ? new Date(Number(year), Number(month), 0).getDate()
    : 31;
  for (let d = 1; d <= maxDay; d++) {
    opts.push({ value: String(d).padStart(2, "0"), label: `${d}일` });
  }
  return opts;
}

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    height: "",
    weight: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.birthYear || !form.birthMonth || !form.birthDay) {
      setError("생년월일을 모두 선택해주세요.");
      return;
    }

    const birth_date = `${form.birthYear}-${form.birthMonth}-${form.birthDay}`;

    setSubmitting(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        birth_date,
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
      });
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GuestGuard>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <div className={styles.logo}>CalorieLens</div>
            <p className={styles.subtitle}>회원가입하고 칼로리를 추적하세요</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}

            <Input
              label="이름"
              placeholder="홍길동"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />

            <Input
              label="이메일"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="8자 이상 입력하세요"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={8}
              required
            />

            <Input
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={form.passwordConfirm}
              onChange={(e) => update("passwordConfirm", e.target.value)}
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
              {submitting ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className={styles.footer}>
            이미 계정이 있으신가요?
            <Link href="/login" className={styles.link}>
              로그인
            </Link>
          </div>
        </Card>
      </div>
    </GuestGuard>
  );
}
