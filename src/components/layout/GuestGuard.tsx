import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/meals/new", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>로딩 중...</p>
      </div>
    );
  }

  if (user) return null;

  return <>{children}</>;
}
