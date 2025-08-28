// Memo 모델 (스키마)

// mongoose 모듈 가져오기
const mongoose = require('mongoose');

// 메모 스키마 정의
const memoSchema = new mongoose.Schema({
    memo_type: { type: String, required: true },
    memo_title: { type: String, required: true },
    memo_content: { type: String, required: true },
    userID: { type: String, required: true }
}, {
    // [추가] 이 옵션을 추가하면 createdAt과 updatedAt이 자동으로 관리됨.
    timestamps: true 
});

// Memo 모델 생성
const Memo = mongoose.model('Memo', memoSchema);

module.exports = Memo;