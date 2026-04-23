import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기록 보기 - CalorieLens",
};

export default function RecordsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
