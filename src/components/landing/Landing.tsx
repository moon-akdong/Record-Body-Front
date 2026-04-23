"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import styles from "./Landing.module.css";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        {/* 좌: 텍스트 */}
        <div className={styles.heroText}>
          <div className={styles.heroLogo}>Recody</div>
          <h1 className={styles.heroTitle}>
            당신의 <span className={styles.heroHighlight}>식단</span>을
            <br />
            스마트하게 기록하세요
          </h1>
          <p className={styles.heroDesc}>
            사진 한 장으로 칼로리를 분석하고, 매일의 영양 섭취를
            한눈에 확인하세요. 건강한 식습관의 시작, Recody와 함께.
          </p>
          <div className={styles.heroBtns}>
            {user ? (
              <Link href="/meals/new" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
                음식 입력하기
              </Link>
            ) : (
              <>
                <Link href="/register" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
                  무료로 시작하기
                </Link>
                <Link href="/login" className={`${styles.heroBtn} ${styles.heroBtnOutline}`}>
                  로그인
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 우: 앱 프리뷰 */}
        <div className={styles.heroPreview}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewDots}>
                <span /><span /><span />
              </div>
            </div>
            <div className={styles.previewBody}>
              {/* 음식 사진 예시 */}
              <div className={styles.previewImageArea}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-primary)" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className={styles.previewImageLabel}>음식 사진을 업로드하세요</span>
              </div>
              {/* 분석 결과 예시 */}
              <div className={styles.previewResults}>
                <div className={styles.previewResultTitle}>분석 결과</div>
                <div className={styles.previewNutrients}>
                  <div className={styles.previewNutrient}>
                    <span className={styles.previewNutrientValue}>520</span>
                    <span className={styles.previewNutrientLabel}>kcal</span>
                  </div>
                  <div className={styles.previewNutrient}>
                    <span className={styles.previewNutrientValue} style={{ color: "#4CAF50" }}>65g</span>
                    <span className={styles.previewNutrientLabel}>탄수화물</span>
                  </div>
                  <div className={styles.previewNutrient}>
                    <span className={styles.previewNutrientValue} style={{ color: "#2196F3" }}>32g</span>
                    <span className={styles.previewNutrientLabel}>단백질</span>
                  </div>
                  <div className={styles.previewNutrient}>
                    <span className={styles.previewNutrientValue} style={{ color: "#FF9800" }}>18g</span>
                    <span className={styles.previewNutrientLabel}>지방</span>
                  </div>
                </div>
                {/* 미니 바 차트 */}
                <div className={styles.previewBars}>
                  <div className={styles.previewBarRow}>
                    <span className={styles.previewBarLabel}>비빔밥</span>
                    <div className={styles.previewBarTrack}><div className={styles.previewBarFill} style={{ width: "85%" }} /></div>
                    <span className={styles.previewBarVal}>320 kcal</span>
                  </div>
                  <div className={styles.previewBarRow}>
                    <span className={styles.previewBarLabel}>된장찌개</span>
                    <div className={styles.previewBarTrack}><div className={styles.previewBarFill} style={{ width: "45%" }} /></div>
                    <span className={styles.previewBarVal}>120 kcal</span>
                  </div>
                  <div className={styles.previewBarRow}>
                    <span className={styles.previewBarLabel}>김치</span>
                    <div className={styles.previewBarTrack}><div className={styles.previewBarFill} style={{ width: "25%" }} /></div>
                    <span className={styles.previewBarVal}>80 kcal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>사진으로 기록</h3>
          <p className={styles.featureDesc}>
            음식 사진을 업로드하면 자동으로 음식을 인식하고 칼로리를 분석합니다.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 20V10" />
              <path d="M12 20V4" />
              <path d="M6 20v-6" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>영양소 분석</h3>
          <p className={styles.featureDesc}>
            칼로리, 탄수화물, 단백질, 지방 등 주요 영양소를 한눈에 파악할 수 있습니다.
          </p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>일별 기록</h3>
          <p className={styles.featureDesc}>
            날짜별로 식사 기록을 관리하고, 영양 섭취 추이를 그래프로 확인하세요.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        &copy; 2025 Recody. All rights reserved.
      </footer>
    </div>
  );
}
