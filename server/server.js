// express 모듈 가져오기
const express = require('express');

// path 모듈을 가져와서 파일 경로를 처리합니다.
const path = require('path');

// bcrypt 모듈 가져오기
const bcrypt = require('bcrypt');

// express-session 모듈 가져오기
const session = require('express-session');

// mongoose 모듈 가져오기
const mongoose = require('mongoose');

// app 이라는 이름의 express 인스턴스 생성
const app = express();

// MongoDB 연결
const mongoURI = 'mongodb://localhost:27017/my_memo_app'; // DB URI 설정
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB에 성공적으로 연결되었습니다.'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// 메모 스키마 정의
const memoSchema = new mongoose.Schema({
    memo_type: String,
    memo_title: String,
    memo_content: String,
    // 새롭게 추가된 필드: 어떤 사용자의 메모인지 식별
    memo_userID: { type: String, required: true }
});

// Memo 모델 생성
const Memo = mongoose.model('Memo', memoSchema);

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 사용자 모델 생성
const User = mongoose.model('User', userSchema);

// 서버가 요청을 처리할 때 사용할 포트 번호 설정
const PORT = 3000;

// 서버가 시작될 때 실행되는 콜백 함수 정의
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 정적 파일(HTML. CSS, JS 등)을 제공하기 위한 미들웨어 설정
// public 폴더를 웹사이트의 루트 디렉토리로 설정합니다.
// 이전에 public 폴더를 만들었다고 가정합니다.
// __dirname은 현재 실행 중인 파일(server.js)의 디렉토리 경로를 나타냅니다.
// path.join()을 사용하면 운영체제에 상관없이 올바른 경로를 만들어줍니다.
// server 폴더에서 상위 폴더(..)로 이동한 뒤, public 폴더를 찾아라
app.use(express.static(path.join(__dirname, '../public')));

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

// 'GET /' 라우트
// 클라이언트가 서버의 루트 경로(/)로 접근했을 때 실행됩니다.
app.get('/', (req, res) => {
    res.redirect('/signup.html'); // 클라이언트를 login.html로 리다이렉트합니다.
});


// 'POST /login' 라우트
// login.html 폼에서 로그인 요청이 들어왔을 때 실행됩니다.
// req.body를 사용하려면 body-parser와 같은 미들웨어가 필요하지만,
// Express 4.16.0 버전 이후부터는 express.json()과 express.urlencoded()로 대체할 수 있습니다.
// 따라서 아래 코드를 추가하여 폼 데이터를 파싱할 수 있게 해줍니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메모리에 임시로 사용자 정보를 저장할 배열 (실제 프로젝트에서는 DB 사용)
// const users = [];

app.post('/login', async (req, res) => {
    // 로그인 폼에서 전달된 아이디와 비밀번호를 받습니다.
    const { id, password } = req.body;
    
    try {
        const user = await User.findOne({id: id});
        if (!user) {
            console.log('로그인 실패: 존재하지 않는 아이디', id);
            return res.status(401).send("<script>alert('존재하지 않는 아이디입니다.'); history.back();</script>"); // 아이디가 존재하지 않는 경우 에러 응답
        }

        // 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = { id: user.id };
            console.log('로그인 성공:', user.id);
            res.redirect('/memo_form.html');
        } else {
            console.log('로그인 실패: 비밀번호 불일치');
            return res.status(401).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>");
        }
    
    } catch (err) {
        console.error('로그인 중 오류 발생:', err);
        res.status(500).send("<script>alert('로그인 중 오류가 발생했습니다.'); history.back();</script>");
    }
});

// 'POST /signup' 라우트
app.post('/signup', async (req, res) => {
    try {
        const { email, id, password, pwcheck } = req.body;

        // 이메일, 아이디 중복 확인
        const existingUser = await User.findOne({ $or: [{ email: email }, {id: id}] });

        if (existingUser) {
            if (existingUser.email === email) {
                console.log('회원가입 실패: 이미 존재하는 이메일', email);
                return res.status(409).send("<script>alert('이미 존재하는 이메일입니다.'); history.back();</script>");
            }
            if (existingUser.id === id) {
                console.log('회원가입 실패: 이미 존재하는 아이디', id);
                return res.status(409).send("<script>alert('이미 존재하는 아이디입니다.'); history.back();</script>");
            }
        }

        // 비밀번호 확인
        if (password !== pwcheck) {
            console.log('회원가입 실패: 비밀번호 불일치');
            return res.status(400).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>");
        }

        // 비밀번호 암호화
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 새로운 User 인스턴스 생성 및 암호화된 비밀번호를 저장
        const newUser = new User({
            email: email,
            id: id,
            password: hashedPassword
        });

        // MongoDB에 새로운 사용자 정보 저장
        await newUser.save();

        console.log('새로운 사용자 등록 성공:', newUser);
        res.status(201).send("<script>alert('회원가입이 완료되었습니다.'); window.location.href = '/login.html';</script>");
    
    } catch (err) {
        console.error('회원가입 중 오류 발생:', err);
        res.status(500).send("<script>alert('회원가입 중 오류가 발생했습니다.'); history.back();</script>");
    }
});

// POST /memo 라우트 (메모 작성 요청 처리)
app.post('/memo', async (req, res) => {
    // try-catch 문을 사용하여 비동기 DB 작업 중 발생할 수 있는 오류를 처리합니다.
    try {
        // 로그인한 사용자의 ID를 세션에서 가져옵니다.
        const userID = req.session.user ? req.session.user.id : null;

        // userID가 세션에 없으면 로그인이 안 된 상태이므로 오류 응답
        if (!userID) {
            console.log('메모 작성 실패: 로그인되지 않은 사용자');
            return res.status(401).send("<script>alert('로그인이 필요합니다.'); window.location.href = '/login.html';</script>");
        }

        const { memo_type, memo_title, memo_content } = req.body;

        // 새로운 Memo 인스턴스를 생성하면서 userID를 추가합니다.
        const newMemo = new Memo({
            memo_type: memo_type,
            memo_title: memo_title,
            memo_content: memo_content,
            memo_userID: userID
        });

        // 생성한 메모를 MongoDB에 저장합니다. await 키워드를 사용해 저장이 완료될 때까지 기다립니다.
        await newMemo.save();

        console.log('새로운 메모가 성공적으로 저장되었습니다:');
        // 메모 저장 성공 시, alert 메시지를 띄우고 memo_form.html로 리다이렉트합니다.
        res.status(201).send("<script>alert('메모를 성공적으로 작성하였습니다!'); window.location.href = '/memo_form.html';</script>");
    
    } catch (err) {
        // 오류 발생 시 오류 메시지를 콘솔에 출력하고, 클라이언트에게 오류 응답을 보냅니다.
        console.log('메모 저장 중 오류 발생:', err);
        res.status(500).send("<script>alert('메모 저장 중 오류가 발생했습니다.'); history.back();</script>");
    }
});

// GET /memo 라우트 (메모 목록 조회)
app.get('/memo', async (req, res) => {
    try {
        // 로그인한 사용자의 ID를 세션에서 가져옵니다.
        const userID = req.session.user ? req.session.user.id : null;

        // userID가 세션에 없으면 로그인이 안 된 상태이므로 오류 응답
        if (!userID) {
            return res.status(401).send("<script>alert('로그인이 필요합니다.'); window.location.href = '/login.html';</script>");
        }

        // 특정 사용자의 메모만 DB에서 조회합니다.
        const userMemos = await Memo.find({ memo_userID : userID });

        // 조회한 메모 목록을 JSON 형식으로 응답합니다.
        res.status(200).json(userMemos);

    } catch (err) {
        console.error('메모 목록 조회 중 오류 발생:', err);
        res.status(500).send("<script>alert('메모 목록 조회 중 오류가 발생했습니다.'); history.back();</script>");
    }
});