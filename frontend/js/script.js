document.addEventListener('DOMContentLoaded', () => {
    const originalTextInput = document.getElementById('original-text');
    const convertedTextInput = document.getElementById('converted-text');
    const convertButton = document.getElementById('convert-button');
    const copyButton = document.getElementById('copy-button');
    const currentCharCount = document.getElementById('current-char-count');
    const targetSelection = document.querySelector('.target-selection');

    const MAX_CHARS = 500;
    const API_ENDPOINT = '/api/convert'; // Assuming backend is on the same origin

    // Character count update
    originalTextInput.addEventListener('input', () => {
        const textLength = originalTextInput.value.length;
        currentCharCount.textContent = textLength;
        if (textLength > MAX_CHARS) {
            originalTextInput.value = originalTextInput.value.substring(0, MAX_CHARS);
            currentCharCount.textContent = MAX_CHARS;
        }
    });

    // Convert button click handler
    convertButton.addEventListener('click', async () => {
        const originalText = originalTextInput.value;
        const selectedTarget = targetSelection.querySelector('input[name="target"]:checked').value;

        if (!originalText) {
            alert('변환할 텍스트를 입력해주세요.');
            return;
        }

        convertButton.textContent = '변환 중...';
        convertButton.disabled = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: originalText,
                    target: selectedTarget
                }),
            });

            const data = await response.json();

            if (response.ok) {
                convertedTextInput.value = data.converted_text;
            } else {
                alert(`변환 오류: ${data.error || '알 수 없는 오류가 발생했습니다.'}`);
                convertedTextInput.value = '';
            }
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
            convertedTextInput.value = '';
        } finally {
            convertButton.textContent = '변환하기';
            convertButton.disabled = false;
        }
    });

    // Copy button click handler
    copyButton.addEventListener('click', () => {
        convertedTextInput.select();
        convertedTextInput.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        alert('변환된 텍스트가 클립보드에 복사되었습니다!');
    });
});
