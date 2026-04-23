import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "식사 상세 - Recody",
};

export default function MealDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
