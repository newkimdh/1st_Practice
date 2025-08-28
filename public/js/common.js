/**
 * 토스트 팝업을 생성하고 보여주는 함수
 * @param {string} message - 팝업에 표시될 메시지
 * @param {string} type - 'success' 또는 'error'
 */
function showToast(message, type = 'success') {
    const container = $('#toast-container');

    // 새로운 div 요소를 만들어 토스트 팝업으로 사용
    const toast = $('<div>')
        .addClass('toast ' + type)
        .text(message);

    container.append(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * fetch 요청에서 발생한 에러를 공통으로 처리하는 함수
 * @param {Response} response - fetch로부터 받은 응답 객체
 * @param {object} options - 추가 옵션. { redirectOnAuth: true } 시 401 에러에 리다이렉트
 */
async function handleFetchError(response, options = {}) {
    // 옵션에서 redirectOnAuth 값을 가져옴. 기본값은 false (리다이렉트 안 함)
    const { redirectOnAuth = false } = options;

    if (response.status === 401) {
        // redirectOnAuth 옵션이 true일 때만 리다이렉트 실행
        if (redirectOnAuth) {
            showToast('세션이 만료되었습니다. 로그인 페이지로 이동합니다.', 'error');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        } else {
            // 그 외의 경우에는 안내 메시지만 보여줌
            showToast('인증에 실패했습니다. 다시 로그인해주세요.', 'error');
        }
        return; // 함수 종료
    }

    // 401 이외의 다른 에러 처리
    const errorData = await response.json();
    showToast(errorData.message || '알 수 없는 오류가 발생했습니다.', 'error');
}