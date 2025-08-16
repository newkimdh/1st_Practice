// Memo 모델 (스키마)

// mongoose 모듈 가져오기
const mongoose = require('mongoose');

// 메모 스키마 정의
const memoSchema = new mongoose.Schema({
    memo_type: String,
    memo_title: String,
    memo_content: String,
    // 새롭게 추가된 필드: 어떤 사용자의 메모인지 식별
    userID: { type: String, required: true },
    // 작성 시간을 저장하는 필드
    createdAt: { type: Date, default: Date.now }
});

// Memo 모델 생성
const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;