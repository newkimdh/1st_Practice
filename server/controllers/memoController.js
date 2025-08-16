// 메모 관련 로직

const Memo = require('../models/Memo');

exports.createMemo = async (req, res) => {
    const { memo_type, memo_title, memo_content } = req.body;
    const userID = req.session.user.id;

    try {
        const newMemo = new Memo({
            memo_type: memo_type,
            memo_title: memo_title,
            memo_content: memo_content,
            userID: userID,
        });

        await newMemo.save();

        console.log('메모 저장 성공:', userID);
        res.status(201).redirect('/memo_list.html');

    } catch (err) {
        console.log('메모 저장 중 오류 발생:', err);
        res.status(500).send("<script>alert('메모 저장 중 오류가 발생했습니다.'); history.back();</script>");
    }
};

exports.getMemos = async (req, res) => {
    const userID = req.session.user.id;

    try {
        const userMemos = await Memo.find({ userID: userID }).sort({ createdAt: -1 });
        console.log('메모 목록 조회 성공:', userID);
        res.status(200).json({
            userID: userID,
            memos: userMemos
        });

    } catch (err) {
        console.error('메모 목록 조회 중 오류 발생:', err);
        res.status(500).send("<script>alert('메모 목록 조회 중 오류가 발생했습니다.'); history.back();</script>");
    }
};

exports.updateMemo = async (req, res) => {
    
};

exports.deleteMemo = async (req, res) => {

};