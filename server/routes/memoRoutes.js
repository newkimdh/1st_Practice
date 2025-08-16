// 메모 관련 라우팅

const express = require('express');
const router = express.Router();
const memoController = require('../controllers/memoController');

// POST /memo 라우트 (메모 생성)
router.post('/', memoController.createMemo);

// GET /memo 라우트 (메모 조회)
router.get('/', memoController.getMemos);

// PUT /memo 라우트 (메모 수정)
router.put('/:id', memoController.updateMemo);

// DELETE /memo 라우트 (메모 삭제)
router.delete('/:id', memoController.deleteMemo);

module.exports = router;