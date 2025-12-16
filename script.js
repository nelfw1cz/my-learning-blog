// ===== СИСТЕМА ЗАЩИТЫ АДМИН-ПАНЕЛИ =====
class AdminProtection {
    constructor() {
        this.adminToken = localStorage.getItem('learningBlog_adminToken');
        this.isAdmin = !!this.adminToken;
        this.init();
    }

    init() {
        console.log('Инициализация защиты админ-панели...');
        this.addLoginButton();
        this.hideAdminElements();
        
        if (this.isAdmin) {
            this.showAdminElements();
        }
    }

    addLoginButton() {
        const nav = document.querySelector('.christmas-nav .container');
        if (!nav) return;
        
        const loginBtn = document.createElement('button');
        loginBtn.id = 'adminLoginBtn';
        loginBtn.innerHTML = '<i class="fas fa-lock"></i> Вход';
        loginBtn.style.cssText = `
            background: linear-gradient(45deg, #3a86ff, #4cc9f0);
            color: white;
            border: none;
            padding: 0.9rem 1.8rem;
            border-radius: 30px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.7rem;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
        `;
        
        loginBtn.addEventListener('click', () => this.showLoginModal());
        nav.appendChild(loginBtn);
    }

    hideAdminElements() {
        const adminElements = [
            '#editSkillsBtn',
            '#postForm',
            '.delete-post-btn',
            '#addPost'
        ];
        
        adminElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    showAdminElements() {
        const adminElements = [
            '#editSkillsBtn',
            '#postForm',
            '#addPost'
        ];
        
        adminElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = element.tagName === 'BUTTON' ? 'inline-flex' : 'block';
            }
        });
        
        const deleteButtons = document.querySelectorAll('.delete-post-btn');
        deleteButtons.forEach(btn => {
            btn.style.display = 'inline-flex';
        });
        
        const loginBtn = document.getElementById('adminLoginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-unlock"></i> Выйти';
            loginBtn.onclick = () => this.logout();
            loginBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ffa726)';
        }
    }

    showLoginModal() {
        const modalHTML = `
            <div id="loginModal" class="modal" style="display: flex;">
                <div class="modal-overlay" id="loginOverlay"></div>
                <div class="modal-content christmas-modal" style="max-width: 450px; background: linear-gradient(135deg, #0d1b2a, #1b263b);">
                    <h3 style="color: #3a86ff; margin-bottom: 15px;">
                        <i class="fas fa-lock"></i> Вход в админ-панель
                    </h3>
                    <p style="color: #778da9; margin-bottom: 20px;">
                        Введите пароль для доступа к управлению контентом:
                    </p>
                    
                    <div class="form-group" style="margin: 20px 0;">
                        <input type="password" id="adminPassword" 
                               placeholder="Пароль администратора" 
                               style="width: 100%; padding: 15px; 
                                      background: rgba(255, 255, 255, 0.1);
                                      border: 2px solid #3a86ff;
                                      border-radius: 10px;
                                      color: white;
                                      font-size: 1rem;">
                    </div>
                    
                    <div id="loginError" style="color: #ff6b6b; display: none; margin: 15px 0; padding: 10px; background: rgba(255, 107, 107, 0.1); border-radius: 8px;">
                        <i class="fas fa-exclamation-circle"></i> Неверный пароль! Попробуйте еще раз.
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 25px;">
                        <button id="submitLogin" class="christmas-button" style="flex: 1;">
                            <i class="fas fa-sign-in-alt"></i> Войти
                        </button>
                        <button id="cancelLogin" style="flex: 1; 
                                background: rgba(255, 255, 255, 0.1);
                                color: white;
                                border: 2px solid rgba(255, 255, 255, 0.3);
                                padding: 12px;
                                border-radius: 30px;
                                cursor: pointer;
                                font-size: 1rem;
                                transition: all 0.3s ease;">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                    </div>
                    
                    
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #e2e2e2; font-weight: bold;">Пароль:</span>
                            <code id="hintPassword" style="background: rgba(0, 0, 0, 0.3); 
                                  padding: 5px 10px; border-radius: 5px; color: #ffd700;">
                                ******
                            </code>
                            <button type="button" id="showHint" 
                                    style="margin-left: auto; 
                                           background: none; 
                                           border: none; 
                                           color: #4cc9f0; 
                                           cursor: pointer;
                                           font-size: 0.9em;">
                                <i class="fas fa-eye"></i> Показать
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupLoginModal();
    }

    setupLoginModal() {
        const modal = document.getElementById('loginModal');
        const overlay = document.getElementById('loginOverlay');
        const cancelBtn = document.getElementById('cancelLogin');
        const submitBtn = document.getElementById('submitLogin');
        const passwordInput = document.getElementById('adminPassword');
        const errorMsg = document.getElementById('loginError');
        const showHintBtn = document.getElementById('showHint');
        const hintPassword = document.getElementById('hintPassword');
        
        const ADMIN_PASSWORD = "Ilovevika193";
        
        const closeModal = () => {
            if (modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        };
        
        overlay?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);
        
        if (showHintBtn) {
            let hintVisible = false;
            showHintBtn.addEventListener('click', () => {
                hintVisible = !hintVisible;
                hintPassword.textContent = hintVisible ? ADMIN_PASSWORD : '******';
                showHintBtn.innerHTML = hintVisible ? 
                    '<i class="fas fa-eye-slash"></i> Скрыть' : 
                    '<i class="fas fa-eye"></i> Показать';
            });
        }
        
        if (submitBtn && passwordInput) {
            submitBtn.addEventListener('click', () => {
                if (passwordInput.value === ADMIN_PASSWORD) {
                    this.isAdmin = true;
                    this.adminToken = 'authenticated_' + Date.now();
                    localStorage.setItem('learningBlog_adminToken', this.adminToken);
                    
                    this.showAdminElements();
                    closeModal();
                    
                    this.showNotification('✅ Добро пожаловать в админ-панель!', 'success');
                } else {
                    errorMsg.style.display = 'block';
                    passwordInput.style.borderColor = '#ff6b6b';
                    passwordInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
                    passwordInput.value = '';
                    
                    setTimeout(() => {
                        errorMsg.style.display = 'none';
                        passwordInput.style.borderColor = '#3a86ff';
                        passwordInput.style.boxShadow = 'none';
                    }, 3000);
                }
            });
            
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') submitBtn.click();
            });
        }
    }

    logout() {
        if (confirm('Выйти из админ-панели?')) {
            localStorage.removeItem('learningBlog_adminToken');
            this.isAdmin = false;
            this.adminToken = null;
            
            this.hideAdminElements();
            
            const loginBtn = document.getElementById('adminLoginBtn');
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-lock"></i> Вход';
                loginBtn.onclick = () => this.showLoginModal();
                loginBtn.style.background = 'linear-gradient(45deg, #3a86ff, #4cc9f0)';
            }
            
            this.showNotification('Вы вышли из админ-панели', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        const bgColor = type === 'success' ? '#4CAF50' : 
                       type === 'error' ? '#ff6b6b' : '#3a86ff';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            z-index: 99999;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            border-left: 5px solid rgba(255, 255, 255, 0.3);
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===== КЛАСС LEARNING BLOG =====
class LearningBlog {
    constructor() {
        this.startLearningDate = new Date(2025, 11, 1);
        this.admin = new AdminProtection();
        this.init();
    }

    init() {
        console.log('Инициализация блога...');
        this.initTheme();
        this.loadData();
        this.initUI();
        this.renderAll();
    }

    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle?.querySelector('i');
        
        if (!themeToggle || !themeIcon) return;
        
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

        this.saveSkills();
        this.savePosts();
    }

    saveSkills() {
        localStorage.setItem('learningBlog_skills', JSON.stringify(this.skills));
    }

    savePosts() {
        localStorage.setItem('learningBlog_posts', JSON.stringify(this.posts));
    }

    checkAdminPermission(action) {
        if (!this.admin.isAdmin) {
            this.admin.showNotification('⚠️ Доступ запрещен! Войдите в админ-панель.', 'error');
            this.admin.showLoginModal();
            return false;
        }
        return true;
    }

    initUI() {
        const editBtn = document.getElementById('editSkillsBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (this.checkAdminPermission('edit_skills')) {
                    this.openSkillsModal();
                }
            });
        }

        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.checkAdminPermission('add_post')) {
                    this.addNewPost();
                }
            });
        }

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
        
        this.skills.forEach((skill, index) => {
            formHTML += `
                <div class="skill-edit" style="
                    display: flex; 
                    align-items: center; 
                    gap: 15px; 
                    margin: 15px 0; 
                    padding: 15px; 
                    background: rgba(255, 255, 255, 0.05); 
                    border-radius: 10px;
                    border-left: 4px solid #3a86ff;">
                    <span style="flex: 1; color: #e2e2e2; font-weight: bold;">${skill.name}</span>
                    <input type="range" min="0" max="100" value="${skill.level}" 
                           class="skill-slider" data-index="${index}"
                           style="flex: 2; 
                                  -webkit-appearance: none;
                                  height: 8px;
                                  background: rgba(58, 134, 255, 0.3);
                                  border-radius: 4px;
                                  outline: none;">
                    <span class="skill-value" style="
                        color: #ffd700; 
                        font-weight: bold; 
                        min-width: 50px;
                        text-align: center;">${skill.level}%</span>
                    <button type="button" class="remove-skill-btn" data-index="${index}"
                            style="
                                background: rgba(255, 107, 107, 0.2);
                                border: 2px solid #ff6b6b;
                                color: #ff6b6b;
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.3s ease;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });

        formHTML += `
            <div id="addSkillSection" style="
                margin-top: 30px; 
                padding: 20px; 
                background: rgba(58, 134, 255, 0.1); 
                border-radius: 10px;
                border: 2px dashed rgba(58, 134, 255, 0.3);">
                <h4 style="color: #3a86ff; margin-bottom: 15px;">
                    <i class="fas fa-plus-circle"></i> Добавить новый навык
                </h4>
                <div id="addSkillForm" style="
                    display: flex; 
                    flex-direction: column; 
                    gap: 15px;">
                    <input type="text" id="newSkillName" placeholder="Название навыка"
                           style="
                                padding: 12px;
                                background: rgba(255, 255, 255, 0.1);
                                border: 2px solid rgba(58, 134, 255, 0.5);
                                border-radius: 8px;
                                color: white;
                                font-size: 1rem;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="color: #778da9;">Уровень:</span>
                        <input type="range" id="newSkillLevel" min="0" max="100" value="50"
                               style="
                                    flex: 1;
                                    -webkit-appearance: none;
                                    height: 8px;
                                    background: rgba(58, 134, 255, 0.3);
                                    border-radius: 4px;
                                    outline: none;">
                        <span id="newSkillValue" style="
                            color: #ffd700; 
                            font-weight: bold; 
                            min-width: 50px;">50%</span>
                    </div>
                    <button type="button" id="addSkillBtn" 
                            style="
                                background: linear-gradient(45deg, #3a86ff, #4cc9f0);
                                color: white;
                                border: none;
                                padding: 12px 25px;
                                border-radius: 30px;
                                cursor: pointer;
                                font-size: 1rem;
                                font-weight: bold;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                transition: all 0.3s ease;
                                align-self: flex-start;">
                        <i class="fas fa-plus"></i> Добавить навык
                    </button>
                </div>
            </div>
        `;

        formContainer.innerHTML = formHTML;
        this.addSkillFormHandlers();
    }

    addSkillFormHandlers() {
        document.querySelectorAll('.skill-slider').forEach(slider => {
            slider.addEventListener('input', function() {
                const value = this.value;
                const valueSpan = this.parentElement.querySelector('.skill-value');
                if (valueSpan) {
                    valueSpan.textContent = `${value}%`;
                }
            });
        });

        document.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.skills.splice(index, 1);
                this.renderSkillsForm();
            });
        });

        const newSkillSlider = document.getElementById('newSkillLevel');
        const newSkillValue = document.getElementById('newSkillValue');
        if (newSkillSlider && newSkillValue) {
            newSkillSlider.addEventListener('input', function() {
                newSkillValue.textContent = `${this.value}%`;
            });
        }

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
                    
                    if (nameInput) nameInput.value = '';
                    if (levelInput) levelInput.value = 50;
                    if (newSkillValue) newSkillValue.textContent = '50%';
                    
                    this.admin.showNotification('✅ Навык добавлен!', 'success');
                }
            });
        }
    }

    saveEditedSkills() {
        document.querySelectorAll('.skill-slider').forEach(slider => {
            const index = parseInt(slider.dataset.index);
            if (!isNaN(index) && this.skills[index]) {
                this.skills[index].level = parseInt(slider.value);
            }
        });

        this.saveSkills();
        this.renderSkills();
        this.closeSkillsModal();
        this.admin.showNotification('✅ Навыки обновлены!', 'success');
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
            this.admin.showNotification('Ошибка: форма не найдена!', 'error');
            return;
        }

        if (!titleInput.value.trim() || !contentInput.value.trim()) {
            this.admin.showNotification('Пожалуйста, заполните все поля!', 'error');
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

        titleInput.value = '';
        contentInput.value = '';
        categoryInput.value = 'general';

        this.admin.showNotification('✅ Новая запись добавлена!', 'success');
        
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
                <div class="empty-state" style="text-align: center; padding: 40px;">
                    <i class="fas fa-pen fa-3x" style="color: #3a86ff; margin-bottom: 20px;"></i>
                    <h3 style="color: #e2e2e2;">Записей пока нет</h3>
                    <p style="color: #778da9;">Добавьте свою первую запись о прогрессе!</p>
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
                    <div class="post-footer" style="
                        display: flex; 
                        justify-content: space-between; 
                        align-items: center; 
                        margin-top: 20px;">
                        <span class="post-date" style="color: #3a86ff;">
                            <i class="far fa-calendar"></i> ${post.date}
                        </span>
                        <button class="delete-post-btn" data-id="${post.id}"
                                style="${this.admin.isAdmin ? '' : 'display: none;'}
                                    background: rgba(255, 107, 107, 0.1);
                                    border: 2px solid #ff6b6b;
                                    color: #ff6b6b;
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.3s ease;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = postsHTML;
        this.addPostDeleteHandlers();
    }

    addPostDeleteHandlers() {
        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.checkAdminPermission('delete_post')) return;
                
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
        this.admin.showNotification('✅ Запись удалена', 'success');
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
        const today = new Date();
        const timeDiff = today.getTime() - this.startLearningDate.getTime();
        const daysDiff = Math.max(1, Math.floor(timeDiff / (1000 * 3600 * 24)));
        
        const daysCounter = document.getElementById('daysCounter');
        const learningTime = document.getElementById('learningTime');
        
        if (daysCounter) daysCounter.textContent = daysDiff;
        if (learningTime) {
            learningTime.textContent = `${daysDiff} ${this.getDayText(daysDiff)}`;
        }

        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = today.toLocaleDateString('ru-RU');
        }

        this.renderSkills();
        this.renderPosts();
    }

    getDayText(days) {
        if (days % 10 === 1 && days % 100 !== 11) return 'день';
        if (days % 10 >= 2 && days % 10 <= 4 && (days % 100 < 10 || days % 100 >= 20)) return 'дня';
        return 'дней';
    }
}

// ===== КЛАСС СНЕЖИНОК (SVG ВЕРСИЯ) =====
class Snowflakes {
    constructor() {
        this.container = null;
        this.isActive = true;
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
        const oldContainer = document.getElementById('snow-container');
        if (oldContainer) oldContainer.remove();
        
        this.container = document.createElement('div');
        this.container.id = 'snow-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
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
            
            [data-theme="dark"] .snowflake-svg {
                filter: drop-shadow(0 0 3px rgba(224, 242, 254, 0.9));
            }
            
            @keyframes flicker {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 0.4; }
            }
        `;
        document.head.appendChild(style);
    }

    createSVGFlake() {
        if (!this.container) return;
        
        const flake = document.createElement('div');
        flake.className = 'snowflake-svg';
        
        const size = Math.random() * 17 + 8;
        const snowflakeSVG = this.getRandomSnowflakeSVG(size);
        flake.innerHTML = snowflakeSVG;
        
        flake.style.left = Math.random() * 100 + 'vw';
        flake.style.top = '-40px';
        
        const duration = Math.random() * 5 + 8;
        const delay = Math.random() * 3;
        flake.style.animation = `snowFall ${duration}s linear ${delay}s infinite`;
        
        if (Math.random() > 0.5) {
            flake.style.animation += `, flicker ${Math.random() * 2 + 1}s infinite alternate`;
        }
        
        this.container.appendChild(flake);
        
        setTimeout(() => {
            if (flake.parentNode) {
                flake.remove();
            }
        }, (duration + delay) * 1000);
    }

    getRandomSnowflakeSVG(size) {
        const snowflakes = [
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 1L15 9L23 12L15 15L12 23L9 15L1 12L9 9L12 1Z" 
                      fill="white" stroke="none"/>
            </svg>`,
            
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 0L14 4L18 6L14 8L12 12L10 8L6 6L10 4L12 0Z" 
                      fill="white" stroke="none"/>
                <path d="M12 12L14 16L18 18L14 20L12 24L10 20L6 18L10 16L12 12Z" 
                      fill="white" stroke="none"/>
            </svg>`,
            
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2" fill="white"/>
                <path d="M12 3L12 21M3 12L21 12M5 5L19 19M5 19L19 5" 
                      stroke="white" stroke-width="1" fill="none"/>
            </svg>`,
            
            `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
                <path d="M12 2L15 6L20 7L16 10L17 15L12 13L7 15L8 10L4 7L9 6L12 2Z" 
                      fill="white" stroke="none"/>
            </svg>`
        ];
        
        return snowflakes[Math.floor(Math.random() * snowflakes.length)];
    }

    addToggle() {
        const oldToggle = document.getElementById('snow-toggle');
        if (oldToggle) oldToggle.remove();
        
        const toggle = document.createElement('button');
        toggle.id = 'snow-toggle';
        toggle.className = 'active';
        toggle.innerHTML = '❄️';
        toggle.title = 'Включить/выключить снег';
        toggle.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(45deg, #3a86ff, #4cc9f0);
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
        `;
        
        toggle.addEventListener('click', () => {
            this.isActive = !this.isActive;
            if (this.isActive) {
                toggle.className = 'active';
                toggle.style.background = 'linear-gradient(45deg, #3a86ff, #4cc9f0)';
                this.start();
                console.log('Снегопад включен');
            } else {
                toggle.className = 'inactive';
                toggle.style.background = '#718096';
                this.stop();
                console.log('Снегопад выключен');
            }
        });
        
        document.body.appendChild(toggle);
    }

    start() {
        if (!this.isActive) return;
        
        if (this.interval) {
            clearInterval(this.interval);
        }
        
        this.interval = setInterval(() => {
            if (this.isActive) {
                this.createSVGFlake();
            }
        }, 100);
        
        console.log('SVG снежинки запущены!');
    }

    stop() {
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
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

// ===== ИНИЦИАЛИЗАЦИЯ TELEGRAM АНИМАЦИЙ =====
function initTelegramAnimations() {
    const telegramCard = document.querySelector('.telegram-card');
    if (telegramCard) {
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
        
        telegramCard.addEventListener('click', function(e) {
            if (e.target.closest('.telegram-link')) return;
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем блог и снежинки...');
    
    const blog = new LearningBlog();
    initTelegramAnimations();
    
    setTimeout(() => {
        try {
            window.snowfall = new Snowflakes();
            console.log('✅ SVG снежинки успешно запущены!');
            
            setTimeout(() => {
                if (window.snowfall) {
                    window.snowfall.start();
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ Ошибка при запуске снежинок:', error);
        }
    }, 500);
    
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
    
    if (window.snowfall) {
        window.snowfall.createSVGFlake();
        console.log('Тестовая снежинка добавлена');
    }
};

// Добавляем анимации в DOM
document.head.insertAdjacentHTML('beforeend', `
<style>
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
</style>
`);
// Пример данных для галереи
let codeSnippets = [
    {
        id: 1,
        title: "Hello World на C++",
        language: "cpp",
        code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
        description: "Классическая первая программа",
        tags: ["начало", "базовый", "пример"],
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Калькулятор на Python",
        language: "python",
        code: `def calculator():\n    while True:\n        try:\n            num1 = float(input("Введите первое число: "))\n            operator = input("Введите оператор (+, -, *, /): ")\n            num2 = float(input("Введите второе число: "))\n            \n            if operator == '+':\n                result = num1 + num2\n            elif operator == '-':\n                result = num1 - num2\n            elif operator == '*':\n                result = num1 * num2\n            elif operator == '/':\n                result = num1 / num2\n            else:\n                print("Неверный оператор!")\n                continue\n                \n            print(f"Результат: {result}")\n        except:\n            print("Ошибка!")`,
        description: "Простой консольный калькулятор",
        tags: ["калькулятор", "python", "начальный"],
        date: "2024-01-20"
    },
    {
        id: 3,
        title: "Игра 'Угадай число'",
        language: "cpp",
        code: `#include <iostream>\n#include <cstdlib>\n#include <ctime>\n\nusing namespace std;\n\nint main() {\n    srand(time(0));\n    int secret = rand() % 100 + 1;\n    int guess, attempts = 0;\n    \n    cout << "Угадайте число от 1 до 100!" << endl;\n    \n    do {\n        cout << "Ваша попытка: ";\n        cin >> guess;\n        attempts++;\n        \n        if (guess < secret) cout << "Слишком мало!" << endl;\n        else if (guess > secret) cout << "Слишком много!" << endl;\n    } while (guess != secret);\n    \n    cout << "Поздравляем! Вы угадали за " << attempts << " попыток." << endl;\n    return 0;\n}`,
        description: "Консольная игра на C++",
        tags: ["игра", "c++", "развлечение"],
        date: "2024-01-25"
    }
];

// Инициализация галереи
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();
    setupFilterButtons();
});

// Рендеринг галереи
function renderGallery(filter = 'all') {
    const gallery = document.getElementById('codeGallery');
    gallery.innerHTML = '';
    
    const filteredSnippets = filter === 'all' 
        ? codeSnippets 
        : codeSnippets.filter(snippet => snippet.language === filter);
    
    filteredSnippets.forEach(snippet => {
        const card = document.createElement('div');
        card.className = 'code-card';
        card.dataset.id = snippet.id;
        card.onclick = () => openModal(snippet);
        
        // Обрезаем код для превью
        const previewCode = snippet.code.length > 100 
            ? snippet.code.substring(0, 100) + '...' 
            : snippet.code;
        
        card.innerHTML = `
            <h3>${snippet.title}</h3>
            <div class="language">${getLanguageName(snippet.language)}</div>
            <div class="code-preview">
                <pre><code class="language-${snippet.language}">${escapeHtml(previewCode)}</code></pre>
            </div>
            <p>${snippet.description}</p>
            <div class="tags">
                ${snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="date">${snippet.date}</div>
        `;
        
        gallery.appendChild(card);
    });
    
    // Переинициализируем подсветку синтаксиса
    if (window.hljs) {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

// Настройка кнопок фильтрации
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            // Применяем фильтр
            renderGallery(this.dataset.filter);
        });
    });
}

// Добавление новой карточки
function addCodeCard() {
    const title = document.getElementById('codeTitle').value.trim();
    const description = document.getElementById('codeDescription').value.trim();
    const code = document.getElementById('codeContent').value.trim();
    const language = document.getElementById('codeLanguage').value;
    const tags = document.getElementById('codeTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!title || !code) {
        alert('Пожалуйста, заполните название и код');
        return;
    }
    
    const newSnippet = {
        id: Date.now(), // Используем timestamp как ID
        title,
        language,
        code,
        description: description || 'Без описания',
        tags: tags.length ? tags : ['новый'],
        date: new Date().toISOString().split('T')[0]
    };
    
    codeSnippets.unshift(newSnippet); // Добавляем в начало
    renderGallery();
    clearForm();
    
    // Показываем уведомление
    showNotification('Код успешно добавлен в галерею!');
}

// Очистка формы
function clearForm() {
    document.getElementById('codeTitle').value = '';
    document.getElementById('codeDescription').value = '';
    document.getElementById('codeContent').value = '';
    document.getElementById('codeTags').value = '';
}

// Открытие модального окна
function openModal(snippet) {
    document.getElementById('modalTitle').textContent = snippet.title;
    document.getElementById('modalLang').textContent = getLanguageName(snippet.language);
    document.getElementById('modalDate').textContent = snippet.date;
    document.getElementById('modalCode').textContent = snippet.code;
    document.getElementById('modalCode').className = `language-${snippet.language}`;
    document.getElementById('modalDesc').textContent = snippet.description;
    
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = snippet.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Подсветка синтаксиса
    if (window.hljs) {
        hljs.highlightElement(document.getElementById('modalCode'));
    }
    
    document.getElementById('codeModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Сохраняем текущий сниппет для копирования/скачивания
    window.currentSnippet = snippet;
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('codeModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    window.currentSnippet = null;
}

// Копирование кода
function copyCode() {
    if (!window.currentSnippet) return;
    
    navigator.clipboard.writeText(window.currentSnippet.code)
        .then(() => {
            showNotification('Код скопирован в буфер обмена!');
        })
        .catch(err => {
            console.error('Ошибка копирования:', err);
            showNotification('Ошибка при копировании', 'error');
        });
}

// Скачивание кода
function downloadCode() {
    if (!window.currentSnippet) return;
    
    const snippet = window.currentSnippet;
    const extension = getFileExtension(snippet.language);
    const filename = `${snippet.title.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
    const content = snippet.code;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Код скачан!');
}

// Вспомогательные функции
function getLanguageName(langCode) {
    const languages = {
        'cpp': 'C++',
        'python': 'Python',
        'javascript': 'JavaScript',
        'html': 'HTML/CSS',
        'other': 'Другое'
    };
    return languages[langCode] || langCode;
}

function getFileExtension(langCode) {
    const extensions = {
        'cpp': 'cpp',
        'python': 'py',
        'javascript': 'js',
        'html': 'html',
        'other': 'txt'
    };
    return extensions[langCode] || 'txt';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'success') {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 10px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Закрытие модального окна по клику вне его
window.onclick = function(event) {
    const modal = document.getElementById('codeModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Добавляем CSS для анимаций уведомлений
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
`;
document.head.appendChild(style);
// ===== ПЕРЕКЛЮЧЕНИЕ ТЕМ =====
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light-blue';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateButtonText(savedTheme);
    
    // Обработчик клика по кнопке
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light-blue' ? 'dark-red' : 'light-blue';
        
        // Применяем новую тему
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateButtonText(newTheme);
        
        // Анимация иконки
        themeIcon.style.transform = newTheme === 'dark-red' ? 'rotate(180deg)' : 'rotate(0deg)';
        
        // Небольшая анимация для всей страницы
        document.body.style.opacity = '0.8';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
    });
    
    function updateButtonText(theme) {
        const button = document.getElementById('themeToggle');
        const icon = theme === 'dark-red' ? '☀️' : '🌙';
        const text = theme === 'dark-red' ? 'Дневная тема' : 'Ночная тема';
        
        button.innerHTML = `<span class="theme-icon">${icon}</span> ${text}`;
    }
    
    // Добавляем плавный переход после загрузки
    setTimeout(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, 100);
});
function updateThemeIndicator(theme) {
    const indicator = document.getElementById('currentTheme');
    indicator.textContent = theme === 'dark-red' ? 'Красно-черная' : 'Синяя';
    indicator.style.color = theme === 'dark-red' ? '#ff4757' : '#2979ff';
}