import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { href: "/meals/new", label: "음식 입력" },
  { href: "/records", label: "기록 보기" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const initial = user.name?.charAt(0) || "U";

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        Recody
      </Link>

      <div className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className={styles.right}>
        <Link to="/profile" className={styles.profileBtn}>
          {initial}
        </Link>
      </div>
    </nav>
  );
}
