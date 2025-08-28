$(function () {
    const signupForm = $('#signup-form');

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

    signupForm.on('submit', async (event) => {
        event.preventDefault();

        // form 데이터를 JavaScript 객체로 변환 (jQuery serializezArray 사용)
        const formData = signupForm.serializeArray();
        const data = {};
        $(formData).each(function(index, obj) {
            data[obj.name] = obj.value;
        });

        try {
            const response = await fetch('/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('서버 응답:', result);
            
            if (response.ok) {
                showToast(result.message, 'success');

                // 3초 후 로그인 페이지 이동
                setTimeout(() => {
                    windonw.location.href = result.redirectUrl;
                }, 3000);
            } else {
                showToast(result.message, 'error');
            }
        } catch (err) {
            console.error('회원가입 요청 오류:', err);
            showToast('네트워크 오류가 발생했습니다.', 'error');
        }
    });
});