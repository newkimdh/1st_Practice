// 사용자 관련 라우팅

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;