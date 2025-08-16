// 기본 모듈 불러오기
const express = require('express');
const path = require('path');
// const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');

// 라우터 모듈 불러오기
const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');

// app 이라는 이름의 express 인스턴스 생성
const app = express();
const PORT = 3000;

// MongoDB 연결
const mongoURI = 'mongodb://localhost:27017/my_memo_app'; // DB URI 설정
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// 서버가 시작될 때 실행되는 콜백 함수 정의
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 정적 파일(HTML. CSS, JS 등)을 제공하기 위한 미들웨어 설정
// public 폴더를 웹사이트의 루트 디렉토리로 설정합니다.
// __dirname은 현재 실행 중인 파일(server.js)의 디렉토리 경로를 나타냅니다.
// path.join()을 사용하면 운영체제에 상관없이 올바른 경로를 만들어줍니다.
// server 폴더에서 상위 폴더(..)로 이동한 뒤, public 폴더를 찾아라
app.use(express.static(path.join(__dirname, '../public')));

// req.body를 사용하려면 body-parser와 같은 미들웨어가 필요하지만,
// Express 4.16.0 버전 이후부터는 express.json()과 express.urlencoded()로 대체할 수 있습니다.
// 따라서 아래 코드를 추가하여 폼 데이터를 파싱할 수 있게 해줍니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 미들웨어 설정
app.use(session({
    secret: 'mysecretkey',   // 세션을 암호화하는 비밀 키
    resave: false,           // 요청이 올 때 세션을 항상 다시 저장할지 여부
    saveUninitialized: true, // 초기화되지 않은 세션을 저장할지 여부
    cookie: {
        secure: false,   // HTTPS가 아닌 환경에서는 false로 설정해야 함.
        maxAge: 3600000  // 세션 만료 시간 (1시간, 밀리초 단위)
    }
}));

// 라우터 미들웨어 등록
app.use('/users', userRoutes);
app.use('/memo', memoRoutes); 
app.get('/', (req, res) => {
    res.redirect('/signup.html'); // 클라이언트를 login.html로 리다이렉트합니다.
});