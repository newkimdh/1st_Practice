$(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const memoID = urlParams.get('id');
    const memoForm = $('#memo-form');

    // 1. 페이지 초기 설정 함수
    function initializePage() {
        if (memoID) {
            // 기존 메모 수정
            $('h1').text('메모 수정');
            $('#btn-submit').text('수정하기');
            fetchMemoData();
        } else {
            // 새 메모 자성
            $('h1').text('새 메모 작성');
            $('#btn-submit').text('작성하기');
        }
    }

    // 2. (수정 시) 서버에서 메모 데이터를 가져와 form에 채우는 함수
    async function fetchMemoData() {
        try {
            const response = await fetch(`/memo/${memoID}`);
            if (!response.ok) {
                return await handleFetchError(response);
            }

            const memo = await response.json();
            console.log('서버 응답 (특정 메모):', memo);

            $('#memo_type').val(memo.memo_type);
            $('#memo_title').val(memo.memo_title);
            $('#memo_content').val(memo.memo_content);

        } catch (err) {
            console.error('메모 불러오기 중 오류', err);
            ShowToast('메모를 불러오는 중 네트워크 오류가 발생했습니다.', 'error');
        }
    }

    // 3. 폼 제출(수정 또는 생성) 이벤트 처리
    memoForm.on('submit', async function(event) {
        event.preventDefault();

        const formData = {
            memo_type: $('#memo_type').val(),
            memo_title: $('#memo_title').val(),
            memo_content: $('#memo_content').val()
        };

        const isUpdating = !!memoID;
        const url = isUpdating ? `/memo/${memoID}` : '/memo';
        const method = isUpdating ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                return await handleFetchError(response);
            }

            console.log(`메모 ${isUpdating ? '수정' : '생성'} 성공`);
            
            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.href = '/memo_list.html';
            }, 1500);
    
        } catch (err) {
            console.error('메모 작성(또는 수정) 요청 처리 중 오류', err);
            showToast(err.message, 'error');
        }
    })

    initializePage();
});