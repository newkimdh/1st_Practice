// 사용자 관련 로직

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { email, id, password, pwcheck } = req.body;

    if (password !== pwcheck) {
        console.log("회원가입 실패: 비밀번호 불일치");
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }
    
    try {
        const existingUser = await User.findOne({ $or: [{email: email}, {id: id}] });
        if (existingUser) {
            if (existingUser.email === email) {
                console.log('회원가입 실패: 이미 존재하는 이메일:', email);
                return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
            }
            if (existingUser.id === id) {
                console.log('회원가입 실패: 이미 존재하는 아이디:', id);
                return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            email: email,
            id: id,
            password: hashedPassword
        });

        await newUser.save();

        console.log('새로운 사용자 등록 성공', newUser);
        res.status(201).json({ message: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.' });

    } catch (err) {
        console.error('회원가입 중 오류 발생');
        res.status(500).json({ message: '회원가입 중 서버 오류가 발생했습니다.' });
    }
};

exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findOne({ id: id });
        if (!user) {
            console.log('로그인 실패: 존재하지 않는 아이디:', id);
            return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = { id: user.id };
            console.log('로그인 성공:', user.id);
            
            req.session.save(err => {
                if (err) {
                    console.error('세션 저장 중 오류:', err);
                    return res.status(500).json({ message: '세선 저장 중 서버 내부 오류가 발생했습니다.' });
                }
                
                res.status(200).json({ 
                    message: '로그인 성공',
                    redirectUrl: '/memo_list.html'
                });
            });
        } else {
            console.log('로그인 실패: 비밀번호 불일치');
            res.status(401).json({ message: '비밀번호 일치하지 않습니다.' });
        }

    } catch (err) {
        console.error('로그인 중 오류 발생', err);
        res.status(500).json({ message: '로그인 중 서버 오류가 발생했습니다.' });
    }
};

exports.logout = async (req, res) => {
    // 로그아웃은 fetch 요청이 아닌 일반적인 form 제출이므로,
    // 페이지를 이동시키는 res.redirect()를 그대로 유지하는 것이 맞습니다.
    const userID = req.session.user.id;

    req.session.destroy(err => {
        if (err) {
            console.error('로그아웃 중 오류 발생:', err);
            return res.status(500).send("로그아웃 중 오류가 발생했습니다.");
        }
        
        console.log('로그아웃:', userID);
        console.log('세션 ID:', req.sessionID);
        res.redirect('/login.html');
    });
};