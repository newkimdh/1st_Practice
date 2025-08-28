// 미들웨어 함수를 exports에 추가

exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        // 다음 미들웨어(또는 라우터)로 넘어감
        next();
    } else {
        console.log('접근 실패: 로그인되지 않은 상태');
        res.status(401).json({ message: '로그인이 필요합니다.' });
    }
};