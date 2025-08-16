// 사용자 관련 로직

const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const { email, id, password, pwcheck } = req.body;

    if (password !== pwcheck) {
        console.log("회원가입 실패: 비밀번호 불일치");
        return res.status(400).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>");
    }
    
    try {
        const existingUser = await User.findOne({ $or: [{email: email}, {id: id}] });
        if (existingUser) {
            if (existingUser.email === email) {
                console.log('회원가입 실패: 이미 존재하는 이메일:', email);
                return res.status(409).send("<script>alert('이미 존재하는 이메일입니다.'); history.back();</script>");
            }
            if (existingUser.id === id) {
                console.log('회원가입 실패: 이미 존재하는 아이디:', id);
                return res.status(409).send("<script>alert('이미 존재하는 아이디입니다.'); history.back();</script>");
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
        res.status(201).send("<script>alert('회원가입이 완료되었습니다.'); window.location.href = '/login.html';</script>");

    } catch (err) {
        console.error('회원가입 중 오류 발생');
        res.status(500).send("<script>alert('회원가입 중 오류가 발생했습니다.'); history.back();</script>");
    }
};

exports.login = async (req, res) => {
    const { id, password } = req.body;

    try {
        const user = await User.findOne({ id: id });
        if (!user) {
            console.log('로그인 실패: 존재하지 않는 아이디:', id);
            return res.status(401).send("<script>alert('존재하지 않는 아이디입니다.'); history.back();</script>"); 
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = { id: user.id };
            console.log('로그인 성공:', user.id);
            res.redirect('/memo_list.html');
        } else {
            console.log('로그인 실패: 비밀번호 불일치');
            res.status(401).send("<script>alert('비밀번호가 일치하지 않습니다.'); history.back();</script>");
        }

    } catch (err) {
        console.error('로그인 중 오류 발생', err);
        res.status(500).send("<script>alert('로그인 중 오류가 발생했습니다.'); history.back();</script>");
    }
};

exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('로그아웃 중 오류 발생:', err);
            return res.status(500).send("<script>alert('로그아웃 중 오류가 발생했습니다.'); history.back();</script>");
        }
        res.redirect('/login.html');
    });
};