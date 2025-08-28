# 로그인 기반 메모 게시판

## 📝 프로젝트 설명

이 프로젝트는 Node.js와 Express를 이용한 백엔드 서버 구축과, `fetch` API를 활용한 비동기 통신을 학습하기 위한 **로그인 기반 메모 게시판 토이 프로젝트**입니다. 사용자는 회원가입 및 로그인 후 자신만의 메모를 생성, 조회, 수정, 삭제(CRUD)할 수 있습니다.

## 💻 기술 스택

* **Frontend**: HTML, CSS, JavaScript (ES6+), jQuery
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (with Mongoose)
* **Version Control**: Git, GitHub

## ✨ 주요 기능

-   [x] **사용자 인증**
    -   [x] 회원가입 및 로그인 기능
    -   [x] 세션(Session) 기반 인증 관리
-   [x] **메모 CRUD**
    -   [x] `fetch`와 `async/await`를 이용한 비동기 통신
    -   [x] 새로고침 없는 메모 생성, 수정, 삭제 (SPA 방식)
-   [x] **UI/UX 개선**
    -   [x] 공용 CSS를 이용한 일관된 UI 디자인
    -   [x] 작업 결과에 따른 토스트(Toast) 팝업 알림
    -   [x] 수정 시간 표시 및 날짜 포맷팅

## 🚀 실행 방법

### 1. 백엔드 서버 실행

```bash
# 1. server 폴더로 이동
cd server

# 2. 필요한 모듈 설치
npm install

# 3. 서버 시작
node server.js
```

서버는 기본적으로 http://localhost:3000에서 실행됩니다.

### 2. 프론트엔드 실행
VS Code의 Live Server 확장 프로그램을 사용하거나, public 폴더의 login.html 파일을 브라우저에서 직접 열어주세요.

```bash
📁 폴더 구조
my-toy-project/
├── public/              # 클라이언트 (HTML, CSS, JS)
│   ├── js/
│   ├── styles/
│   └── *.html
├── server/              # 서버 (Node.js)
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
├── .gitignore
└── README.md
```
