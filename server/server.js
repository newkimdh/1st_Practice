// express 모듈 가져오기
const express = require('express');

// path 모듈을 가져와서 파일 경로를 처리합니다.
const path = require('path');

// app 이라는 이름의 express 인스턴스 생성
const app = express();

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


// 'GET /' 경로로 들어오는 요청에 대한 라우터
// 클라이언트가 서버의 루트 경로(/)로 접근했을 때 실행됩니다.
app.get('/', (req, res) => {
    res.redirect('/signup.html'); // 클라이언트를 login.html로 리다이렉트합니다.
});


// 'POST /login' 요청에 대한 라우트
// login.html 폼에서 로그인 요청이 들어왔을 때 실행됩니다.
// req.body를 사용하려면 body-parser와 같은 미들웨어가 필요하지만,
// Express 4.16.0 버전 이후부터는 express.json()과 express.urlencoded()로 대체할 수 있습니다.
// 따라서 아래 코드를 추가하여 폼 데이터를 파싱할 수 있게 해줍니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 메모리에 임시로 사용자 정보를 저장할 배열 (실제 프로젝트에서는 DB 사용)
const users = [];

app.post('/login', (req, res) => {
    // 로그인 폼에서 전달된 아이디와 비밀번호를 받습니다.
    const { id, password } = req.body;
    
    const user = users.find(user => user.id === id);
    if (!user) {
        console.log('로그인 실패: 존재하지 않는 아이디', id);
        return res.status(401).send("<script>alert('존재하지 않는 아이디입니다.'); history.back();</script>"); // 아이디가 존재하지 않는 경우 에러 응답
    }

    // bcrypt.compare()를 사용하여 입력된 비밀번호와 저장된 해시된 비밀번호를 비교합니다.
    bcrypt.compare(password, user.password, (err, isMatch) => { 
        if (err) {
            console.error('비밀번호 비교 중 오류 발생:', err);
            return res.status(500).send("<script>alert('로그인 중 오류가 발생했습니다.'); history.back();</script>"); // 로그인 중 오류 발생 시 에러 응답
        }
        if (isMatch) {
            console.log(`로그인 성공: ID : ${user.id}`);
            res.redirect('/memo_form.html');
        } else {
            console.log('로그인 실패: 비밀번호 불일치');
            return res.status(401).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>");
        }
    });
});

const bcrypt = require('bcrypt');
app.post('/signup', (req, res) => {
    // 회원가입 폼에서 전달된 아이디와 비밀번호를 받습니다.
    const { email, id, password, pwcheck } = req.body;

    const isEmailExists = users.find(user => user.email === email);
    if (isEmailExists) {
        console.log('회원가입 실패: 이미 존재하는 이메일', email);
        return res.status(409).send("<script>alert('이미 존재하는 이메일입니다.'); history.back();</script>"); // 이미 존재하는 이메일인 경우 에러 응답
    }

    const isIdExists = users.find(user => user.id === id);
    if (isIdExists) {
        console.log('회원가입 실패: 이미 존재하는 아이디', id);
        return res.status(409).send("<script>alert('이미 존재하는 아이디입니다.'); history.back();</script>"); // 이미 존재하는 아이디인 경우 에러 응답
    }

    if (password !== pwcheck) {
        console.log('회원가입 실패: 비밀번호 불일치');
        return res.status(400).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>"); // 비밀번호와 비밀번호 확인이 일치하지 않는 경우 에러 응답
    }

    const saltRounds = 10; // 암호화 연산 횟수 (보안 강도)
    bcrypt.hash(password, saltRounds, (err, hashedPW) => {
        if (err) {
            console.error('비밀번호 암호화 중 오류 발생:', err);
            return res.status(500).send("<script>alert('비밀번호 암호화 중 오류가 발생했습니다.'); history.back();</script>"); // 암호화 중 오류 발생 시 에러 응답
        }

        const newUser = {
            email,
            id,
            password: hashedPW // 암호화된 비밀번호 저장
        };

        users.push(newUser); // 사용자 정보를 배열에 추가
        console.log('새로운 사용자 등록:', newUser);
        res.status(201).redirect('/login.html'); // 회원가입 성공 시 login.html로 리다이렉트합니다.
    });
    // 이 위치에 res.redirect가 있으면 안 됩니다.
    // bcrypt.hash는 비동기 함수이므로, 이 줄은 암호화가 완료되기 전에 실행됩니다.
    // res.redirect('/login.html'); 
});

app.post('/logout', (req, res) => {
    console.log('사용자가 로그아웃했습니다.');
    res.redirect('/login.html'); // 로그아웃 후 로그인 페이지로 리다이렉트합니다.
});

app.post('/memo', (req, res) => {
    const { memo } = req.body;
    if (!memo) {
        console.log('메모가 비어 있습니다.');
        return res.status(400).send("<script>alert('메모를 입력해주세요.'); history.back();</script>"); // 메모가 비어 있는 경우 에러 응답
    }
    console.log(`새로운 메모: ${memo}`);
    res.send("<script>alert('메모가 저장되었습니다.'); window.location.href = '/memo_form.html';</script>"); // 메모 저장 후 메모 폼 페이지로 리다이렉트합니다.
});