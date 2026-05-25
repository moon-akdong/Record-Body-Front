import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import Card from "@/components/ui/Card";
import styles from "@/app/profile/page.module.css";

const GENDER_LABELS: Record<string, string> = {
  male: "남성",
  female: "여성",
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) return null;

  const stats = [
    { label: "키", value: `${user.height}`, unit: "cm" },
    { label: "몸무게", value: `${user.weight}`, unit: "kg" },
    { label: "성별", value: GENDER_LABELS[user.gender] || user.gender, unit: "" },
    { label: "나이", value: `${new Date().getFullYear() - new Date(user.birth_date).getFullYear()}`, unit: "세" },
  ];

  return (
    <AuthGuard>
      <div className={styles.container}>
        <Card className={styles.profileHeader}>
          <div className={styles.avatar}>{user.name.charAt(0)}</div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{user.name}</span>
            <span className={styles.profileEmail}>{user.email}</span>
          </div>
        </Card>

        <div>
          <div className={styles.sectionTitle}>신체 정보</div>
          <div className={styles.statsGrid}>
            {stats.map((s) => (
              <Card key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>
                  {s.value}
                  {s.unit && <span style={{ fontSize: 12, fontWeight: 400 }}>{s.unit}</span>}
                </span>
                <span className={styles.statLabel}>{s.label}</span>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <div className={styles.sectionTitle}>계정 설정</div>
          <div className={styles.menuList}>
            <div className={styles.menuItem} onClick={() => navigate("/profile/edit")}>
              회원 정보 수정
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div className={styles.menuItem} onClick={() => navigate("/profile/body")}>
              신체 정보 변경
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div className={styles.menuItem}>
              비밀번호 변경
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
            <div className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
              로그아웃
              <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
}
