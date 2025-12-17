// auth-fix.js - исправление авторизации
document.addEventListener('DOMContentLoaded', function() {
    // Ждём 1 секунду, потом показываем кнопку гостя
    setTimeout(() => {
        const loginModal = document.getElementById('loginModal');
        if (loginModal && loginModal.style.display !== 'none') {
            // Создаём кнопку "Пропустить"
            const skipBtn = document.createElement('button');
            skipBtn.textContent = 'Пропустить →';
            skipBtn.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                padding: 8px 16px;
                background: transparent;
                border: 1px solid var(--border);
                color: var(--text-secondary);
                border-radius: 5px;
                cursor: pointer;
                z-index: 10000;
            `;
            skipBtn.onclick = function() {
                window.currentUser = { username: 'Гость', role: 'guest' };
                loginModal.style.display = 'none';
                window.updateUIForUser && window.updateUIForUser();
            };
            document.body.appendChild(skipBtn);
        }
    }, 1000);
});