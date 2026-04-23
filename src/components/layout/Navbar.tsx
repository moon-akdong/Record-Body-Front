"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { href: "/meals/new", label: "음식 입력" },
  { href: "/records", label: "기록 보기" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const initial = user.name?.charAt(0) || "U";

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        CalorieLens
      </Link>

      <div className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className={styles.right}>
        <Link href="/profile" className={styles.profileBtn}>
          {initial}
        </Link>
      </div>
    </nav>
  );
}
