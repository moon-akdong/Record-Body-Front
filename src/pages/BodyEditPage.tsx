import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateBody } from "@/lib/api";
import styles from "@/app/body-edit/page.module.css";

export default function BodyEditPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setHeight(String(user.height));
      setWeight(String(user.weight));
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!height || !weight) {
      setError("키와 몸무게를 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await updateBody({
        height: Number(height),
        weight: Number(weight),
      });
      await refreshUser();
      setSuccess("신체 정보가 수정되었습니다.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "신체 정보 수정에 실패했습니다."
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

        <h1 className={styles.title}>신체 정보 수정</h1>
        <p className={styles.subtitle}>키와 몸무게를 수정할 수 있습니다</p>

        <Card>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

            <div className={styles.row}>
              <Input
                label="키 (cm)"
                type="number"
                placeholder="170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
              <Input
                label="몸무게 (kg)"
                type="number"
                placeholder="65"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
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
