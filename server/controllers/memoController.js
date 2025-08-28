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
        res.status(201).json({ 
            message: '메모가 저장되었습니다',
            redirectUrl: '/memo_list.html'
        });

    } catch (err) {
        console.log('메모 저장 중 오류 발생:', err);
        res.status(500).json({ message: '메모 저장 중 오류가 발생했습니다.' });
    }
};

exports.getMemos = async (req, res) => {
    try {
        const userID = req.session.user.id;

        const userMemos = await Memo.find({ userID: userID }).sort({ createdAt: -1 });
        console.log('메모 목록 조회 성공:', userID);
        res.status(200).json({
            userID: userID,
            memos: userMemos
        });

    } catch (err) {
        console.error('메모 목록 조회 중 오류 발생:', err);
        res.status(500).json({ message: '메모 목록 조회 중 오류가 발생했습니다.' });
    }
};

exports.getMemoById = async (req, res) => {
    const { id } = req.params;
    try {
        const memo = await Memo.findById(id);
        if (!memo) {
            return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
        }
        res.status(200).json(memo);
    } catch (err) {
        console.error('메모 조회 중 오류 발생:', err);
        res.status(500).json({ message: '메모 조회 중 서버 오류가 발생했습니다.' });
    }
};

exports.updateMemo = async (req, res) => {
    try {
        // 1. 클라이언트가 보낸 URL 파라미터에서 수정할 메모의 ID를 가져온다.
        const { id } = req.params;

        // 2. 클라이언트가 보낸 body에서 수정할 내용을 가져온다.
        const { memo_type, memo_title, memo_content } = req.body;

        // 3. DB에서 해당 ID의 메모를 찾아 업데이트한다.
        const updatedMemo = await Memo.findByIdAndUpdate(
            id,
            { memo_type, memo_title, memo_content },
            { new: true } // 이 옵션은 업데이트된 결과를 반환하도록 함
        );

        if (!updatedMemo) {
            return res.status(404).json({ message: '수정할 메모를 찾을 수 없습니다.' });
        }

        console.log(`[서버] 메모 수정 성공: (ID: ${id})`);
        res.status(200).json({ message: '메모가 성공적으로 수정되었습니다.' });

    } catch (err) {
        console.error('메모 수정 중 오류 발생', err);
        res.status(500).json({ message: '메모 수정 중 오류가 발생했습니다.' });
    }
};

exports.deleteMemo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMemo = await Memo.findByIdAndDelete(id);

        if (!deletedMemo) {
            return res.status(404).json({ message: '삭제할 메모를 찾을 수 없습니다.' });
        }

        res.status(500).json({ message: '메모가 삭제되었습니다.' });
    
    } catch (err) {
        console.error('메모 삭제 중 오류 발생:', err);
        res.status(500).json({ message: '메모 삭제 중 오류가 발생했습니다.' });
    }
};