// 메모 관련 라우팅

const express = require('express');
const router = express.Router();

const memoController = require('../controllers/memoController');
const authMiddleware = require('../middlewares/auth');

// POST /memo 라우트 (메모 생성)
router.post('/', authMiddleware.isAuthenticated, memoController.createMemo);

// GET /memo 라우트 (메모 조회)
router.get('/', authMiddleware.isAuthenticated, memoController.getMemos)

router.get('/:id', authMiddleware.isAuthenticated, memoController.getMemoById);

// PUT /memo 라우트 (메모 수정)
router.put('/:id', authMiddleware.isAuthenticated, memoController.updateMemo);

// DELETE /memo 라우트 (메모 삭제)
router.delete('/:id', authMiddleware.isAuthenticated, memoController.deleteMemo);

module.exports = router;