console.log('Скрипт снежинок загружен!');
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, можно запускать снежинки');
});

// ===== КЛАСС СНЕЖИНОК (SVG ВЕРСИЯ) =====
class Snowflakes {
    constructor() {
        this.container = null;
        this.isActive = true; // Автоматически включены
        this.interval = null;
        this.init();
    }

    init() {
        console.log('Инициализация SVG снежинок...');
        this.createContainer();
        this.addStyles();
        this.start();
        this.addToggle();
    }

    createContainer() {
        // Удаляем старый контейнер если есть
        const oldContainer = document.getElementById('snow-container');
        if (oldContainer) oldContainer.remove();
        
        this.container = document.createElement('div');
        this.container.id = 'snow-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
        // Удаляем старые стили если есть
        const oldStyle = document.getElementById('snow-styles');
        if (oldStyle) oldStyle.remove();
        
        const style = document.createElement('style');
        style.id = 'snow-styles';
        style.textContent = `
            #snow-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                overflow: hidden;
            }
            
            @keyframes snowFall {
                0% {
                    transform: translateY(-30px) rotate(0deg) translateX(0);
                    opacity: 0.9;
                }
                100% {
                    transform: translateY(110vh) rotate(720deg) translateX(50px);
                    opacity: 0;
                }
            }
            
            .snowflake-svg {
                position: absolute;
                opacity: 0.8;
                filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.8));
                animation-timing-function: linear;
            }
            
            /* Для темной темы */
            [data-theme="dark"] .snowflake-svg {
                filter: drop-shadow(0 0 3px rgba(224, 242, 254, 0.9));
            }
            
            /* Переключатель снежинок */
            #snow-toggle {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: var(--primary, #4a6fa5);
                color: white;
                border: none;
                cursor: pointer;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 3px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            }
            
            #snow-toggle:hover {
                transform: scale(1.15);
                box-shadow: 0 5px 15px rgba(0,0,0,0.4);
            }
            
            #snow-toggle.active {
                background: #2c5282;
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            }
            
            #snow-toggle.inactive {
                opacity: 0.5;
                background: #718096;
            }
        `;
        document.head.appendChild(style);
    }

    createSVGFlake() {
        if (!this.container) return;
        
        const flake = document.createElement('div');
        flake.className = 'snowflake-svg';
        
        // Размер: 8-25px
        const size = Math.random() * 17 + 8;
        
        // Случайный тип снежинки
        const snowflakeSVG = this.getRandomSnowflakeSVG(size);
        flake.innerHTML = snowflakeSVG;
        
        // Позиция
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.top = '-40px';
        
        // Анимация
        const duration = Math.random() * 5 + 8; // 8-13 секунд
        const delay = Math.random() * 3;
        flake.style.animation = `snowFall ${duration}s linear ${delay}s infinite`;
        
        // Случайное мерцание
        if (Math.random() > 0.5) {
            flake.style.animation += `, flicker ${Math.random() * 2 + 1}s infinite alternate`;
        }
        
        this.container.appendChild(flake);
        
        // Автоматическое удаление
        setTimeout(() => {
            if (flake.parentNode) {
                flake.remove();
            }
        }, (duration + delay) * 1000);
    }

    getRandomSnowflakeSVG(size) {
        const snowflakes = [
            // Простая звезда
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 1L15 9L23 12L15 15L12 23L9 15L1 12L9 9L12 1Z" 
                      fill="white" stroke="none"/>
            </svg>`,
            
            // Кристаллическая снежинка
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 0L14 4L18 6L14 8L12 12L10 8L6 6L10 4L12 0Z" 
                      fill="white" stroke="none"/>
                <path d="M12 12L14 16L18 18L14 20L12 24L10 20L6 18L10 16L12 12Z" 
                      fill="white" stroke="none"/>
            </svg>`,
            
            // Кружевная снежинка
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2" fill="white"/>
                <path d="M12 3L12 21M3 12L21 12M5 5L19 19M5 19L19 5" 
                      stroke="white" stroke-width="1" fill="none"/>
            </svg>`,
            
            // Шестиугольная снежинка
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 2L15 6L20 7L16 10L17 15L12 13L7 15L8 10L4 7L9 6L12 2Z" 
                      fill="white" stroke="none"/>
            </svg>`
        ];
        
        return snowflakes[Math.floor(Math.random() * snowflakes.length)];
    }

    addToggle() {
        // Удаляем старый переключатель если есть
        const oldToggle = document.getElementById('snow-toggle');
        if (oldToggle) oldToggle.remove();
        
        const toggle = document.createElement('button');
        toggle.id = 'snow-toggle';
        toggle.className = 'active';
        toggle.innerHTML = '❄️';
        toggle.title = 'Включить/выключить снег';
        
        toggle.addEventListener('click', () => {
            this.isActive = !this.isActive;
            if (this.isActive) {
                toggle.className = 'active';
                this.start();
                console.log('Снегопад включен');
            } else {
                toggle.className = 'inactive';
                this.stop();
                console.log('Снегопад выключен');
            }
        });
        
        document.body.appendChild(toggle);
    }

    start() {
        if (!this.isActive) return;
        
        // Очищаем предыдущий интервал
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        // Добавляем мерцание
        if (!document.querySelector('#flicker-animation')) {
            const flickerStyle = document.createElement('style');
            flickerStyle.id = 'flicker-animation';
            flickerStyle.textContent = `
                @keyframes flicker {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 0.4; }
                }
            `;
            document.head.appendChild(flickerStyle);
        }
        
        // Создаем снежинки
        this.interval = setInterval(() => {
            if (this.isActive) {
                this.createSVGFlake();
            }
        }, 100); // Каждые 100ms
        
        console.log('SVG снежинки запущены!');
    }

    stop() {
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        // Быстро удаляем снежинки
        if (this.container) {
            const flakes = this.container.querySelectorAll('.snowflake-svg');
            flakes.forEach(flake => {
                flake.style.animation = 'none';
                flake.style.opacity = '0';
                setTimeout(() => flake.remove(), 300);
            });
        }
    }
}

// ===== КЛАСС LEARNING BLOG =====
class LearningBlog {
    constructor() {
        // Дата начала обучения: 1 декабря 2025 года
        this.startLearningDate = new Date(2025, 11, 1); // Месяцы 0-11 (декабрь = 11)
        this.init();
    }

    init() {
        console.log('Инициализация блога...');
        
        // Инициализация темы
        this.initTheme();
        
        // Инициализация данных
        this.loadData();
        
        // Инициализация UI
        this.initUI();
        
        // Рендер данных
        this.renderAll();
    }

    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('i');
        
        if (!themeToggle || !themeIcon) return;
        
        // Проверяем сохранённую тему
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        }
        
        themeToggle.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.className = 'fas fa-moon';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.className = 'fas fa-sun';
            }
        });
    }

    loadData() {
        // Навыки по умолчанию
        this.skills = JSON.parse(localStorage.getItem('learningBlog_skills')) || [
            { name: "HTML/CSS", level: 95 },
            { name: "JavaScript", level: 90 },
            { name: "Python", level: 85 },
            { name: "C#", level: 70 },
            { name: "React", level: 80 },
            { name: "Git", level: 75 },
            { name: "SQL", level: 60 },
            { name: "ASP.NET", level: 40 }
        ];

        // Записи по умолчанию
        this.posts = JSON.parse(localStorage.getItem('learningBlog_posts')) || [
            {
                id: Date.now(),
                title: "Освоил продвинутые концепции C#",
                content: "Сегодня разобрался с асинхронным программированием (async/await) и делегатами. Написал небольшое приложение для загрузки данных с использованием Tasks.",
                category: "csharp",
                date: new Date().toLocaleDateString('ru-RU'),
                tags: ["C#", "Async", "Delegates"]
            },
            {
                id: Date.now() - 86400000,
                title: "Завершил проект на React + ASP.NET",
                content: "Закончил разработку full-stack приложения для управления задачами. Frontend на React с TypeScript, бэкенд на ASP.NET Core Web API.",
                category: "projects",
                date: new Date(Date.now() - 86400000).toLocaleDateString('ru-RU'),
                tags: ["React", "ASP.NET", "TypeScript", "Full-stack"]
            }
        ];

        // Сохраняем начальные данные
        this.saveSkills();
        this.savePosts();
    }

    saveSkills() {
        localStorage.setItem('learningBlog_skills', JSON.stringify(this.skills));
    }

    savePosts() {
        localStorage.setItem('learningBlog_posts', JSON.stringify(this.posts));
    }

    initUI() {
        // Инициализация кнопки редактирования навыков
        const editBtn = document.getElementById('editSkillsBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.openSkillsModal());
        }

        // Инициализация формы добавления поста
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewPost();
            });
        }

        // Инициализация модального окна
        this.initModal();
    }

    initModal() {
        const modal = document.getElementById('skillsModal');
        const closeBtn = document.getElementById('closeModalBtn');
        const saveBtn = document.getElementById('saveSkillsBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSkillsModal());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveEditedSkills());
        }

        // Закрытие по клику вне модального окна
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSkillsModal();
                }
            });
        }
    }

    openSkillsModal() {
        console.log('Открываем модальное окно навыков');
        const modal = document.getElementById('skillsModal');
        if (!modal) {
            console.error('Модальное окно не найдено!');
            return;
        }
        
        this.renderSkillsForm();
        modal.classList.add('show');
    }

    closeSkillsModal() {
        const modal = document.getElementById('skillsModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    renderSkillsForm() {
        const formContainer = document.getElementById('skillsForm');
        if (!formContainer) return;

        let formHTML = '<div class="skills-form">';
        
        // Существующие навыки
        this.skills.forEach((skill, index) => {
            formHTML += `
                <div class="skill-edit">
                    <span>${skill.name}</span>
                    <input type="range" min="0" max="100" value="${skill.level}" 
                           class="skill-slider" data-index="${index}">
                    <span class="skill-value">${skill.level}%</span>
                    <button type="button" class="remove-skill-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        // Форма добавления нового навыка
        formHTML += `
            <div id="addSkillSection">
                <h4><i class="fas fa-plus-circle"></i> Добавить новый навык</h4>
                <div id="addSkillForm">
                    <input type="text" id="newSkillName" placeholder="Название навыка">
                    <input type="range" id="newSkillLevel" min="0" max="100" value="50">
                    <span id="newSkillValue">50%</span>
                    <button type="button" id="addSkillBtn" class="primary-btn">
                        <i class="fas fa-plus"></i> Добавить
                    </button>
                </div>
            </div>
        `;

        formContainer.innerHTML = formHTML;

        // Добавляем обработчики
        this.addSkillFormHandlers();
    }

    addSkillFormHandlers() {
        // Обработчики для слайдеров
        document.querySelectorAll('.skill-slider').forEach(slider => {
            slider.addEventListener('input', function() {
                const value = this.value;
                const valueSpan = this.parentElement.querySelector('.skill-value');
                if (valueSpan) {
                    valueSpan.textContent = `${value}%`;
                }
            });
        });

        // Обработчики для удаления навыков
        document.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.skills.splice(index, 1);
                this.renderSkillsForm();
            });
        });

        // Обработчик для слайдера нового навыка
        const newSkillSlider = document.getElementById('newSkillLevel');
        const newSkillValue = document.getElementById('newSkillValue');
        if (newSkillSlider && newSkillValue) {
            newSkillSlider.addEventListener('input', function() {
                newSkillValue.textContent = `${this.value}%`;
            });
        }

        // Обработчик для добавления нового навыка
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('newSkillName');
                const levelInput = document.getElementById('newSkillLevel');
                
                if (nameInput && nameInput.value.trim()) {
                    this.skills.push({
                        name: nameInput.value.trim(),
                        level: parseInt(levelInput?.value || 50)
                    });
                    
                    this.saveSkills();
                    this.renderSkillsForm();
                    this.renderSkills();
                    
                    // Очищаем поля
                    if (nameInput) nameInput.value = '';
                    if (levelInput) levelInput.value = 50;
                    if (newSkillValue) newSkillValue.textContent = '50%';
                    
                    this.showNotification('Навык добавлен!');
                }
            });
        }
    }

    saveEditedSkills() {
        // Сохраняем изменения из всех слайдеров
        document.querySelectorAll('.skill-slider').forEach(slider => {
            const index = parseInt(slider.dataset.index);
            if (!isNaN(index) && this.skills[index]) {
                this.skills[index].level = parseInt(slider.value);
            }
        });

        this.saveSkills();
        this.renderSkills();
        this.closeSkillsModal();
        this.showNotification('Навыки обновлены!');
    }

    renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container) return;

        let skillsHTML = '<h3>Мои навыки:</h3>';
        
        this.skills.forEach(skill => {
            let progressClass = 'progress';
            if (skill.level >= 80) progressClass += ' progress-expert';
            else if (skill.level >= 60) progressClass += ' progress-advanced';
            else if (skill.level >= 40) progressClass += ' progress-intermediate';
            else progressClass += ' progress-beginner';

            skillsHTML += `
                <div class="skill-bar">
                    <span>${skill.name}</span>
                    <div class="bar">
                        <div class="${progressClass}" style="width: ${skill.level}%"></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = skillsHTML;
    }

    addNewPost() {
        const titleInput = document.getElementById('postTitle');
        const contentInput = document.getElementById('postContent');
        const categoryInput = document.getElementById('postCategory');

        if (!titleInput || !contentInput || !categoryInput) {
            this.showNotification('Ошибка: форма не найдена!', 'error');
            return;
        }

        if (!titleInput.value.trim() || !contentInput.value.trim()) {
            this.showNotification('Пожалуйста, заполните все поля!', 'error');
            return;
        }

        const newPost = {
            id: Date.now(),
            title: titleInput.value.trim(),
            content: contentInput.value.trim(),
            category: categoryInput.value,
            date: new Date().toLocaleDateString('ru-RU'),
            tags: []
        };

        this.posts.push(newPost);
        this.savePosts();
        this.renderPosts();

        // Очищаем форму
        titleInput.value = '';
        contentInput.value = '';
        categoryInput.value = 'general';

        this.showNotification('Новая запись добавлена!');
        
        // Прокручиваем к постам
        setTimeout(() => {
            const postsSection = document.getElementById('posts');
            if (postsSection) {
                postsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }

    renderPosts() {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        if (this.posts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pen fa-3x"></i>
                    <h3>Записей пока нет</h3>
                    <p>Добавьте свою первую запись о прогрессе!</p>
                </div>
            `;
            return;
        }

        let postsHTML = '';
        const sortedPosts = [...this.posts].sort((a, b) => b.id - a.id);

        sortedPosts.forEach(post => {
            const categoryName = this.getCategoryName(post.category);
            
            postsHTML += `
                <div class="post" data-id="${post.id}">
                    <span class="post-category">${categoryName}</span>
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    ${post.tags && post.tags.length > 0 ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="post-footer">
                        <span class="post-date"><i class="far fa-calendar"></i> ${post.date}</span>
                        <button class="delete-post-btn" data-id="${post.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = postsHTML;

        // Добавляем обработчики удаления
        this.addPostDeleteHandlers();
    }

    addPostDeleteHandlers() {
        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(e.currentTarget.dataset.id);
                if (confirm('Удалить эту запись?')) {
                    this.deletePost(postId);
                }
            });
        });
    }

    deletePost(postId) {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.savePosts();
        this.renderPosts();
        this.showNotification('Запись удалена');
    }

    getCategoryName(category) {
        const categories = {
            'general': '📝 Общее',
            'csharp': '🔷 C#',
            'javascript': '🟨 JavaScript',
            'python': '🐍 Python',
            'web': '🌐 Веб',
            'algorithms': '🧮 Алгоритмы',
            'projects': '🚀 Проекты',
            'problems': '✅ Задачи'
        };
        return categories[category] || category;
    }

    renderAll() {
        // СЧИТАЕМ ДНИ С 1 ДЕКАБРЯ 2025 ГОДА
        const today = new Date();
        const timeDiff = today.getTime() - this.startLearningDate.getTime();
        const daysDiff = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
        
        // Обновляем счётчик дней
        const daysCounter = document.getElementById('daysCounter');
        const learningTime = document.getElementById('learningTime');
        
        if (daysCounter) daysCounter.textContent = daysDiff;
        if (learningTime) {
            learningTime.textContent = `${daysDiff} ${this.getDayText(daysDiff)}`;
        }

        // Обновляем дату
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = today.toLocaleDateString('ru-RU');
        }

        // Рендерим навыки и посты
        this.renderSkills();
        this.renderPosts();
    }

    // Метод для правильного склонения слова "день"
    getDayText(days) {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
        return 'дней';
    }

    showNotification(message, type = 'success') {
        // Удаляем предыдущие уведомления
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем блог и снежинки...');
    
    // Запускаем блог
    const blog = new LearningBlog();
    
    // Запускаем снежинки через небольшую задержку
    setTimeout(() => {
        try {
            window.snowfall = new Snowflakes();
            console.log('✅ SVG снежинки успешно запущены!');
            
            // Автоматически включаем через 1 секунду
            setTimeout(() => {
                if (window.snowfall) {
                    window.snowfall.start();
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при запуске снежинок:', error);
        }
    }, 500);
    
    // Инициализируем кнопку переключения снега из HTML
    const toggleSnowBtn = document.getElementById('toggleSnow');
    if (toggleSnowBtn) {
        toggleSnowBtn.addEventListener('click', () => {
            if (window.snowfall) {
                window.snowfall.isActive = !window.snowfall.isActive;
                if (window.snowfall.isActive) {
                    window.snowfall.start();
                    toggleSnowBtn.innerHTML = '<i class="fas fa-snowflake"></i> Снег: ВКЛ';
                    console.log('Снегопад включен (через кнопку)');
                } else {
                    window.snowfall.stop();
                    toggleSnowBtn.innerHTML = '<i class="fas fa-snowflake"></i> Снег: ВЫКЛ';
                    console.log('Снегопад выключен (через кнопку)');
                }
            }
        });
    }
});

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ОТЛАДКИ =====
window.toggleSnow = function() {
    if (window.snowfall) {
        window.snowfall.isActive = !window.snowfall.isActive;
        if (window.snowfall.isActive) {
            window.snowfall.start();
            console.log('Снегопад включен (через консоль)');
        } else {
            window.snowfall.stop();
            console.log('Снегопад выключен (через консоль)');
        }
    }
};

window.debugSnow = function() {
    console.log('=== ДЕБАГ СНЕЖИНОК ===');
    console.log('Snowfall объект:', window.snowfall);
    console.log('Контейнер:', document.getElementById('snow-container'));
    console.log('Снежинки на экране:', document.querySelectorAll('.snowflake-svg').length);
    
    // Тестовая снежинка
    if (window.snowfall) {
        window.snowfall.createSVGFlake();
        console.log('Тестовая снежинка добавлена');
    }
};
// Анимация для Telegram блока
function initTelegramAnimations() {
    const telegramCard = document.querySelector('.telegram-card');
    if (telegramCard) {
        // Появление с задержкой
        setTimeout(() => {
            telegramCard.style.opacity = '0';
            telegramCard.style.transform = 'translateY(20px)';
            telegramCard.style.display = 'flex';
            
            setTimeout(() => {
                telegramCard.style.transition = 'all 0.8s ease';
                telegramCard.style.opacity = '1';
                telegramCard.style.transform = 'translateY(0)';
            }, 100);
        }, 1000);
        
        // Эффект при клике
        telegramCard.addEventListener('click', function(e) {
            if (e.target.closest('.telegram-link')) return;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Плавающая кнопка - появляется при прокрутке
    const telegramFloat = document.querySelector('.telegram-float-btn');
    if (telegramFloat) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                telegramFloat.style.opacity = '1';
                telegramFloat.style.transform = 'translateY(0)';
            } else {
                telegramFloat.style.opacity = '0';
                telegramFloat.style.transform = 'translateY(20px)';
            }
        });
    }
}

// Вызовите в DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... ваш существующий код ...
    initTelegramAnimations();
});