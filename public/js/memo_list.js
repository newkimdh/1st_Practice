$(function() {
    const nameTag = $('#user-name');
    const memoListContainer = $('#memo-list');

    // 날짜를 YYYY-MM-DD HH:MM:SS 형식으로 변환하는 함수
    function formatDate(dateString) {
        const date = new Date(dateString);    
        const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }        

        async function fetchMemos() {
            try {
                const response = await fetch(window.location.origin + '/memo');
                
                if (!response.ok) {
                    // [수정] 에러 발생 시 공통 에러 처리 함수 호출
                    return await handleFetchError(response, { redirectOnAuth: true });
                }

                const data = await response.json();
                const userID = data.userID
                const memos = data.memos;

                nameTag.text(`${userID}`);
                const loadingMessage = document.querySelector('.loading-message');
                
                if (loadingMessage) {
                    loadingMessage.remove();
                }
                    
                // 기존 목록 초기화
                memoListContainer.empty();
                    
                if (memos.length === 0) {                
                    memoListContainer.innerHTML = '<div class="no-memos">아직 작성된 메모가 없습니다.</div>';
                    return;                  
                }
                   
                memos.forEach(memo => {                
                    // jQuery 로 div 요소 생성, data-id와 클래스 동시 설정                
                    const memoDiv = $('<div>')         
                    .addClass('memo-item')                
                    .attr('data-id', memo._id);
                    
                    const headerDiv = $('<div>').addClass('memo-header');

                    const title = $('<h3>').addClass('memo-title')                    
                    .text(`[${memo.memo_type}] ${memo.memo_title}`);

                    const dateInfo = $('<p>').addClass('memo-date');
                    const createdAt = formatDate(memo.createdAt);
                    const updatedAt = formatDate(memo.updatedAt);
                    
                    if (new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000) {
                        dateInfo.html(`${createdAt} <span class="updated-text">(수정됨: ${updatedAt})</span>`);
                    } else {
                        dateInfo.text(createdAt);
                    }                

                    const content = $('<p>').addClass('memo-content')                    
                    .text(memo.memo_content);
                    
                    const actionsDiv = $('<div>').addClass('memo-actions');                    
                    const editButton = $('<button>').addClass('btn edit-button')                    
                    .text('수정');                    
                    const deleteButton = $('<button>').addClass('btn delete-button')                    
                    .text('삭제');

                    headerDiv.append(title, dateInfo);
                    actionsDiv.append(editButton, deleteButton);

                    memoDiv.append(headerDiv, content, actionsDiv);                    
                    memoListContainer.append(memoDiv);                    
                });

                console.log('[클라이언트] 메모 목록 로딩 성공');
                
            } catch (error) {            
                console.error('[클라이언트] 메모 목록을 불러오는 중 오류 발생:', error);            
                showToast('메모 목록을 불러오는 중 네트워크 오류가 발생했습니다.', 'error');
            }
        }
        
    // 수정 및 삭제 버튼에 대한 이벤트 리스너 추가        
    // 동적으로 추가되는 버튼이므로, 부모 요소에 이벤트 위임        
    memoListContainer.on('click', '.edit-button', async (event) => {        
        const memoItem = $(event.target).closest('.memo-item');        
        const memoID = memoItem.data('id');     
        
        window.location.href = `/memo_form.html?id=${memoID}`;            
    });
        
    memoListContainer.on('click', '.delete-button', async (event) => {
        const deleteButton = $(event.target);
        const memoItem = deleteButton.closet('.memo-item');      
        const memoID = memoItem.data('id');

        if (confirm('정말 이 메모를 삭제하시겠습니까?')) {
            // 1. 요청 시작: 버튼 비활성화
            deleteButton.prop('disabled', true).text('삭제 중...');

            try {        
                const response = await fetch(`/memo/${memoID}`, {        
                    method: 'DELETE'        
                });
                
                const result = await response.json();

                if (response.ok) {                    
                    showToast(result.message, 'success');                   
                    fetchMemos(); // 새로고침               
                } else {                    
                    return await handleFetchError(response);                  
                }
            } catch (err) {                
                console.error('삭제 요청 중 오류:', err);                
                showToast('메모 삭제 중 오류가 발생했습니다.' + err.message, 'success');                
            
                // 2. 요청 실패: 버튼 다시 활성화
                deleteButton.prop('disabled', false).text('삭제');
            }                
        }            
    });
        
    fetchMemos();        
});