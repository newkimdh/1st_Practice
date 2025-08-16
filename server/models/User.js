// User 모델 (스키마)

// mongoose 모듈 가져오기
const mongoose = require('mongoose');

// 사용자 스키마 정의
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 사용자 모델 생성
const User = mongoose.model('User', userSchema);

// 이 모듈은 User 모델 객체 하나만 내보냄
module.exports = User;