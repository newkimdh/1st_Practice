$(function () {
    const loginForm = $('#login-form');

    loginForm.on('submit', async (event) => {
        event.preventDefault(); // 폼의 기본 제출 동작을 막습니다.

        const formData = {
            id: $('#id').val(),
            password: $('#password').val()
        };

        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            console.log('서버 응답:', result);

            if (response.ok) {
                // 로그인 성공 시 서버에서 받은 URL로 리디렉션
                window.location.href = result.redirectUrl;
            } else {
                const errorData = await response.json();
                showToast(errorData.message, 'error');
            }
        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error);
            showToast('로그인 요청 중 오류가 발생했습니다.', 'error');
        }
    });
});