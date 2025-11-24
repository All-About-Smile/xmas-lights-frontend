# 🎄 **Xmas Lights Frontend**
> “밝혀줘! 내 X-Mas 전구” 프론트엔드 웹 애플리케이션  
React + Vite 기반 팀 프로젝트

---

## 📌 **프로젝트 개요**
이 프로젝트는 **온라인 크리스마스 롤링페이퍼 서비스**  
“밝혀줘! 내 X-mas 전구”의 프론트엔드 레포지토리입니다.

- React + TypeScript 기반 SPA
- Vite를 사용한 빠르고 현대적인 개발 환경
- FastAPI 백엔드와 연동 예정

---

## 🏗️ **기술 스택**
- **React 19**  
- **TypeScript**
- **Vite**
- **ESLint**
- **Prettier**

---

## 🚀 **프로젝트 실행 방법**

### 1) Node.js 버전 통일  
(권장: Node **20.x**)

`nvm` 사용 시:

```bash
nvm install 20
nvm use 20
```

---

### 2) 패키지 설치

```bash
npm install
```

---

### 3) 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서:

```
http://localhost:5173
```

---

## 📁 **프로젝트 구조**

```
.
├── public/
│   └── (favicon, og-image, robots.txt 등 정적 파일)
│
└── src/
    ├── assets/       # 이미지, SVG 등 UI 리소스
    ├── components/   # 공용 컴포넌트
    ├── pages/        # 라우팅되는 페이지들
    ├── styles/       # CSS 관련 파일
    ├── App.tsx
    └── main.tsx
```

---

## 🧩 **이미지/정적 파일 정책**

| 위치 | 용도 |
|------|------|
| `src/assets` | 버튼 이미지, 배경 이미지, UI 리소스 |
| `public/` | favicon, robots.txt, og 이미지 등 브라우저 직접 접근 파일 |

---

## 🔧 **코드 규칙**

### ▶ Lint 검사
```bash
npm run lint
```

### ▶ 저장 시 자동 정렬(Prettier) 권장  
VSCode 사용 시 플러그인 추천:
- ESLint
- Prettier – Code Formatter

---

## 🌐 **백엔드 연동(FastAPI)**  
추후 API 주소는 `.env` 또는 `.env.example`을 통해 관리될 예정.

예시 (나중에 추가 예정):

```
VITE_API_URL=http://localhost:8000
```

---

## 📌 **커밋 규칙 (Conventional Commits 권장)**

예시:

```
chore: initialize React + Vite project
feat: add home page UI
fix: correct button image path
refactor: update folder structure
```

---

## 🤝 **기여 가이드**
- 브랜치 전략: feature 브랜치 → main 머지 방식
- PR 시 리뷰 1인 승인 필요

---

## 📄 라이선스
해당 프로젝트는 팀 내부 개발 목적입니다.
