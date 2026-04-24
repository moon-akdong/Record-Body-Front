"use client";

import { useRef, useState, ChangeEvent } from "react";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  previewUrl: string;
  onFileSelect: (file: File | null) => void;
}

export default function ImageUploader({ previewUrl, onFileSelect }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  }

  const preview = previewUrl;

  return (
    <>
      <div
        className={`${styles.uploader} ${preview ? styles.hasImage : ""}`}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="음식 사진" className={styles.preview} />
        ) : (
          <>
            <svg className={styles.icon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span className={styles.text}>음식 사진을 업로드하세요</span>
            <span className={styles.hint}>클릭하여 파일 선택</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hidden}
        onChange={handleChange}
      />
    </>
  );
}
