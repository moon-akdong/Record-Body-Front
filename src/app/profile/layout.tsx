import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지 - CalorieLens",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
