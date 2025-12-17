// ====== СИСТЕМА АВТОРИЗАЦИИ ======
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '12345'
};

let currentUser = null;

function initAuthSystem() {
    // Всегда загружаем как гость
    currentUser = { username: 'Гость', role: 'guest' };
    updateUIForUser();
    hideLoginModal();
    
    // Кнопка входа для администратора
    const loginBtn = document.createElement('button');
    loginBtn.id = 'adminLoginBtn';
    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти как админ';
    loginBtn.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 10px 20px;
        background: rgba(255, 71, 87, 0.1);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        border-radius: 25px;
        cursor: pointer;
        z-index: 1000;
        font-size: 0.9rem;
    `;
    loginBtn.onclick = showLoginModal;
    document.body.appendChild(loginBtn);
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        currentUser = {
            username: username,
            role: 'admin',
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('blogUser', JSON.stringify(currentUser));
        hideLoginModal();
        updateUIForUser();
        showNotification('✅ Успешный вход!', 'success');
    } else {
        showNotification('❌ Неверный логин или пароль', 'error');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('blogUser');
    updateUIForUser();
    showLoginModal();
    showNotification('👋 До свидания!', 'info');
}

function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    disableUserControls(true);
}

function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function updateUIForUser() {
    const loginModal = document.getElementById('loginModal');
    const logoutBtn = document.getElementById('logoutBtn');
    const addCodeForm = document.querySelector('.add-code-form');
    const progressControls = document.querySelectorAll('.progress-controls');
    
    if (currentUser) {
        // Пользователь авторизован
        loginModal.style.display = 'none';
        logoutBtn.style.display = 'flex';
        
        // Показываем элементы управления
        if (addCodeForm) addCodeForm.style.display = 'block';
        progressControls.forEach(control => {
            control.style.display = 'flex';
        });
        
        // Обновляем приветствие в header
        const logo = document.querySelector('.logo');
        if (logo && !document.getElementById('userGreeting')) {
            const greeting = document.createElement('div');
            greeting.id = 'userGreeting';
            greeting.innerHTML = `
                <span style="
                    font-size: 0.9rem;
                    color: var(--accent-light);
                    margin-left: 15px;
                    border-left: 2px solid var(--accent-red);
                    padding-left: 15px;
                ">
                    <i class="fas fa-user"></i> Привет, ${currentUser.username}!
                </span>
            `;
            logo.appendChild(greeting);
        }
    } else {
        // Пользователь не авторизован
        loginModal.style.display = 'flex';
        logoutBtn.style.display = 'none';
        
        // Скрываем элементы управления
        if (addCodeForm) addCodeForm.style.display = 'none';
        progressControls.forEach(control => {
            control.style.display = 'none';
        });
        
        // Убираем приветствие
        const greeting = document.getElementById('userGreeting');
        if (greeting) greeting.remove();
    }
}

function disableUserControls(disabled) {
    const addCodeForm = document.querySelector('.add-code-form');
    const progressControls = document.querySelectorAll('.progress-controls');
    const progressBtns = document.querySelectorAll('.progress-btn');
    
    if (disabled) {
        if (addCodeForm) addCodeForm.style.pointerEvents = 'none';
        if (addCodeForm) addCodeForm.style.opacity = '0.5';
        progressControls.forEach(control => {
            control.style.pointerEvents = 'none';
            control.style.opacity = '0.5';
        });
        progressBtns.forEach(btn => btn.disabled = true);
    } else {
        if (addCodeForm) addCodeForm.style.pointerEvents = 'auto';
        if (addCodeForm) addCodeForm.style.opacity = '1';
        progressControls.forEach(control => {
            control.style.pointerEvents = 'auto';
            control.style.opacity = '1';
        });
        progressBtns.forEach(btn => btn.disabled = false);
    }
}

// ====== СИСТЕМА ОТСЛЕЖИВАНИЯ ДНЕЙ ======
function calculateDays() {
    const startDate = new Date('2025-12-01');
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

function updateDayCounter() {
    const days = calculateDays();
    document.getElementById('daysCounter').textContent = days;
    
    // Разблокируем достижение через 50 дней
    if (days >= 50) {
        const ach2 = document.getElementById('ach2');
        if (ach2) {
            ach2.classList.remove('locked');
            ach2.innerHTML = '<i class="fas fa-medal"></i><div><h4>50 дней кодинга</h4><p>Программирую 50 дней подряд</p></div>';
        }
    }
}

// ====== СИСТЕМА ПРОГРЕССА ======
let progressData = JSON.parse(localStorage.getItem('progressData')) || {
    cpp: 15,
    python: 10
};

function updateProgress(language) {
    // Проверяем авторизацию
    if (!currentUser) {
        showNotification('❌ Войдите для изменения прогресса', 'error');
        return;
    }
    
    const input = document.getElementById(`${language}Input`);
    const value = parseInt(input.value);
    
    if (!isNaN(value) && value >= 0 && value <= 100) {
        progressData[language] = value;
        localStorage.setItem('progressData', JSON.stringify(progressData));
        
        // Обновляем отображение
        const percentElement = document.getElementById(`${language}Percent`);
        const progressElement = document.getElementById(`${language}Progress`);
        
        if (percentElement) percentElement.textContent = `${value}%`;
        if (progressElement) progressElement.style.width = `${value}%`;
        
        // Анимация
        if (progressElement) {
            progressElement.style.transition = 'width 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        }
        
        // Разблокируем достижение для C++
        if (language === 'cpp' && value >= 70) {
            const ach4 = document.getElementById('ach4');
            if (ach4) {
                ach4.classList.remove('locked');
                ach4.innerHTML = '<i class="fas fa-medal"></i><div><h4>C++ на 70%</h4><p>Освоил 70% языка C++</p></div>';
            }
        }
        
        if (input) input.value = '';
        
        showNotification(`✅ Прогресс ${language.toUpperCase()} обновлён: ${value}%`);
    } else {
        showNotification('❌ Введите число от 0 до 100', 'error');
    }
}

function loadProgress() {
    // Загружаем прогресс C++
    const cppPercent = document.getElementById('cppPercent');
    const cppProgress = document.getElementById('cppProgress');
    if (cppPercent) cppPercent.textContent = `${progressData.cpp}%`;
    if (cppProgress) cppProgress.style.width = `${progressData.cpp}%`;
    
    // Загружаем прогресс Python
    const pythonPercent = document.getElementById('pythonPercent');
    const pythonProgress = document.getElementById('pythonProgress');
    if (pythonPercent) pythonPercent.textContent = `${progressData.python}%`;
    if (pythonProgress) pythonProgress.style.width = `${progressData.python}%`;
    
    // Разблокируем достижения если нужно
    if (progressData.cpp >= 70) {
        const ach4 = document.getElementById('ach4');
        if (ach4) {
            ach4.classList.remove('locked');
            ach4.innerHTML = '<i class="fas fa-medal"></i><div><h4>C++ на 70%</h4><p>Освоил 70% языка C++</p></div>';
        }
    }
}

// ====== ГАЛЕРЕЯ КОДА ======
let codeSnippets = JSON.parse(localStorage.getItem('codeSnippets')) || [
    {
        id: 1,
        title: "Hello World на C++",
        language: "cpp",
        code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
        description: "Классическая первая программа",
        tags: ["начало", "базовый", "пример"],
        date: new Date().toISOString().split('T')[0]
    }
];

function renderGallery(filter = 'all') {
    const gallery = document.getElementById('codeGallery');
    if (!gallery) return;
    
    gallery.innerHTML = '';
    
    const filteredSnippets = filter === 'all' 
        ? codeSnippets 
        : codeSnippets.filter(snippet => snippet.language === filter);
    
    // Обновляем счетчик
    const snippetCount = document.getElementById('snippetCount');
    if (snippetCount) snippetCount.textContent = `${filteredSnippets.length} сниппетов`;
    
    filteredSnippets.forEach(snippet => {
        const snippetElement = document.createElement('div');
        snippetElement.className = 'code-snippet';
        snippetElement.onclick = () => viewCode(snippet);
        
        // Обрезаем код для превью
        const previewCode = snippet.code.length > 150 
            ? snippet.code.substring(0, 150) + '...' 
            : snippet.code;
        
        snippetElement.innerHTML = `
            <div class="snippet-header">
                <h3>${snippet.title}</h3>
                <span class="snippet-language">${snippet.language.toUpperCase()}</span>
            </div>
            <p class="text-secondary">${snippet.description}</p>
            <div class="code-preview">
                <pre>${escapeHtml(previewCode)}</pre>
            </div>
            <div class="snippet-tags">
                ${snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                <span class="tag">${snippet.date}</span>
            </div>
        `;
        
        gallery.appendChild(snippetElement);
    });
}

function addCodeSnippet() {
    // Проверяем авторизацию
    if (!currentUser) {
        showNotification('❌ Войдите для добавления кода', 'error');
        return;
    }
    
    const title = document.getElementById('codeTitle')?.value.trim();
    const language = document.getElementById('codeLanguage')?.value;
    const code = document.getElementById('codeContent')?.value.trim();
    const tags = document.getElementById('codeTags')?.value.split(',').map(t => t.trim()).filter(t => t) || [];
    const description = document.getElementById('codeDescription')?.value.trim() || 'Без описания';
    
    if (!title || !code) {
        showNotification('❌ Заполните название и код!', 'error');
        return;
    }
    
    const newSnippet = {
        id: Date.now(),
        title,
        language,
        code,
        description,
        tags: tags.length ? tags : ['новый'],
        date: new Date().toISOString().split('T')[0]
    };
    
    codeSnippets.unshift(newSnippet);
    localStorage.setItem('codeSnippets', JSON.stringify(codeSnippets));
    
    renderGallery('all');
    clearCodeForm();
    
    // Разблокируем достижение для 10 проектов
    if (codeSnippets.length >= 10) {
        const ach3 = document.getElementById('ach3');
        if (ach3) {
            ach3.classList.remove('locked');
            ach3.innerHTML = '<i class="fas fa-medal"></i><div><h4>10 проектов</h4><p>Создал 10 учебных проектов</p></div>';
        }
    }
    
    showNotification('✅ Код добавлен в галерею!');
}

function clearCodeForm() {
    const titleInput = document.getElementById('codeTitle');
    const contentInput = document.getElementById('codeContent');
    const tagsInput = document.getElementById('codeTags');
    const descInput = document.getElementById('codeDescription');
    
    if (titleInput) titleInput.value = '';
    if (contentInput) contentInput.value = '';
    if (tagsInput) tagsInput.value = '';
    if (descInput) descInput.value = '';
}

function viewCode(snippet) {
    if (!snippet) return;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: var(--bg-card);
            border: 2px solid var(--accent-red);
            border-radius: 15px;
            padding: 30px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
        ">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            ">
                <h2>${escapeHtml(snippet.title)}</h2>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                    background: var(--accent-red);
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                ">
                    ✕ Закрыть
                </button>
            </div>
            <p>${escapeHtml(snippet.description)}</p>
            <div style="
                background: rgba(0,0,0,0.5);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
                max-height: 60vh;
                overflow-y: auto;
            ">
                ${escapeHtml(snippet.code)}
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${snippet.tags.map(tag => `
                    <span style="
                        background: rgba(255,71,87,0.2);
                        color: var(--accent-light);
                        padding: 5px 15px;
                        border-radius: 15px;
                    ">${escapeHtml(tag)}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====== СИСТЕМА ТЕМ ======
function setupThemeSystem() {
    // Переключение новогодней темы
    const holidayToggle = document.getElementById('holidayToggle');
    if (holidayToggle) {
        holidayToggle.addEventListener('click', toggleHolidayTheme);
        
        // Загружаем сохранённую тему
        const savedHoliday = localStorage.getItem('holidayTheme') || 'off';
        document.documentElement.setAttribute('data-holiday', savedHoliday);
        updateHolidayButton(savedHoliday);
        
        if (savedHoliday === 'on') {
            createHolidayEffects();
        }
    }
    
    // Переключение цветовой темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleColorTheme);
        
        // Загружаем сохранённую тему
        const savedTheme = localStorage.getItem('colorTheme') || 'dark-red';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeButton(savedTheme);
    }
}

function toggleHolidayTheme() {
    const current = document.documentElement.getAttribute('data-holiday');
    const newTheme = current === 'on' ? 'off' : 'on';
    
    document.documentElement.setAttribute('data-holiday', newTheme);
    localStorage.setItem('holidayTheme', newTheme);
    updateHolidayButton(newTheme);
    
    if (newTheme === 'on') {
        createHolidayEffects();
    } else {
        const effects = document.getElementById('holidayEffects');
        if (effects) effects.innerHTML = '';
    }
    
    showNotification(newTheme === 'on' ? '🎄 С Новым Годом!' : '❄️ Новогодняя тема выключена');
}

function updateHolidayButton(theme) {
    const btn = document.getElementById('holidayToggle');
    if (!btn) return;
    
    const icon = theme === 'on' ? '🎅' : '🎄';
    const text = theme === 'on' ? 'Обычная тема' : 'Новогодняя тема';
    btn.innerHTML = `<i class="fas fa-tree"></i><span>${icon} ${text}</span>`;
}

function createHolidayEffects() {
    const container = document.getElementById('holidayEffects');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Добавляем мерцающие огоньки
    for (let i = 0; i < 20; i++) {
        const light = document.createElement('div');
        light.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: ${Math.random() > 0.5 ? '#ff9e00' : '#ff6d00'};
            border-radius: 50%;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
            animation: twinkle ${2 + Math.random() * 3}s infinite;
            box-shadow: 0 0 10px currentColor;
        `;
        container.appendChild(light);
    }
}

function toggleColorTheme() {
    const themes = ['dark-red', 'dark-blue', 'dark-purple'];
    const current = document.documentElement.getAttribute('data-theme') || 'dark-red';
    const currentIndex = themes.indexOf(current);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('colorTheme', newTheme);
    updateThemeButton(newTheme);
    
    const themeNames = {
        'dark-red': '🔴 Красно-чёрная',
        'dark-blue': '🔵 Сине-чёрная', 
        'dark-purple': '🟣 Фиолетово-чёрная'
    };
    
    showNotification(`🎨 Тема изменена: ${themeNames[newTheme]}`);
}

function updateThemeButton(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    
    const themeIcons = {
        'dark-red': '🔴',
        'dark-blue': '🔵',
        'dark-purple': '🟣'
    };
    
    const themeNames = {
        'dark-red': 'Тема',
        'dark-blue': 'Синяя тема',
        'dark-purple': 'Фиолетовая тема'
    };
    
    btn.innerHTML = `<i class="fas fa-palette"></i><span>${themeIcons[theme] || '🎨'} ${themeNames[theme] || 'Тема'}</span>`;
}

// ====== ФИЛЬТРЫ ГАЛЕРЕИ ======
function setupGalleryFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter') || 'all';
            renderGallery(filter);
        });
    });
}

// ====== УВЕДОМЛЕНИЯ ======
function showNotification(message, type = 'info') {
    const colors = {
        success: '#2ecc71',
        error: '#ff4757',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ====== ИНИЦИАЛИЗАЦИЯ ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Блог о прогрессе загружается...');
    
    // Добавляем стили для анимаций
    addAnimationStyles();
    
    // 1. Система авторизации (первое, что запускается)
    initAuthSystem();
    
    // 2. Остальные системы (только если пользователь авторизован)
    if (currentUser) {
        updateDayCounter();
        loadProgress();
        renderGallery();
        setupGalleryFilters();
        setupThemeSystem();
    }
    
    console.log('✅ Инициализация завершена');
});

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
function initAuthSystem() {
    // Проверяем, авторизован ли пользователь
    const savedUser = localStorage.getItem('blogUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        hideLoginModal();
        updateUIForUser();
    } else {
        showLoginModal();
    }
    
    // Обработчик входа
    document.getElementById('loginSubmit').addEventListener('click', handleLogin);
    
    // Обработчик гостевого доступа (ДОБАВЬ ЭТО!)
    const guestBtn = document.getElementById('guestAccessBtn');
    if (guestBtn) {
        guestBtn.addEventListener('click', function() {
            currentUser = { username: 'Гость', role: 'guest' };
            hideLoginModal();
            updateUIForUser();
            showNotification('👋 Добро пожаловать как гость!', 'info');
        });
    }
    
    // ... остальной код
}