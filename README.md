# Recody - 식사 칼로리 기록 서비스

식사를 기록하고 영양 성분을 관리할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 회원가입 / 로그인
- 식사 기록 등록 (사진 업로드, 음식 항목, 메모)
- 날짜별 식사 기록 조회
- 일일 영양 성분 요약 (칼로리, 탄수화물, 단백질, 지방, 당류)
- 월별 캘린더에서 기록된 날짜 확인
- 사용자 프로필 관리

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | React 19, TypeScript |
| Build Tool | Vite 6 |
| Routing | React Router DOM 7 |
| Styling | CSS Modules |
| Deployment | Docker (Nginx) |

## 시작하기

### 사전 요구사항

- Node.js 20+
- npm

### 설치

```bash
git clone https://github.com/moon-akdong/record-body-front.git
cd record-body-front
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.development` 파일을 생성합니다.

```
VITE_API_URL=http://127.0.0.1:8000
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
npm run preview  # 빌드 결과 미리보기
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run typecheck` | TypeScript 타입 검사 |
| `npm run lint` | ESLint 코드 검사 |

## 프로젝트 구조

```
src/
├── pages/          # 페이지 컴포넌트
├── components/
│   ├── ui/         # 공통 UI 컴포넌트 (Button, Card, Input 등)
│   ├── layout/     # 레이아웃 (Navbar, AuthGuard)
│   ├── meal/       # 식사 관련 컴포넌트
│   └── records/    # 기록 조회 컴포넌트
├── contexts/       # React Context (인증 상태)
├── hooks/          # 커스텀 훅
├── lib/            # API 클라이언트, 인증 유틸리티
├── types/          # TypeScript 타입 정의
└── app/            # CSS Modules
```

## Docker 배포

```bash
docker build -t recody-front .
docker run -p 80:80 recody-front
```

Nginx가 SPA 라우팅과 `/api/*` 경로의 백엔드 프록시를 처리합니다.

## 백엔드

이 프로젝트는 별도의 FastAPI 백엔드 서버가 필요합니다. `VITE_API_URL` 환경 변수로 백엔드 주소를 지정합니다.
