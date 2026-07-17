document.addEventListener('DOMContentLoaded', () => {
    const showcaseFrame = document.querySelector('iframe[name="showcase"]');
    
    // 0. Inject SEO Metadata
    function injectMetadata() {
        if (typeof seoData === 'undefined') return;

        document.title = seoData.title;

        const createMeta = (name, content) => {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        };
        
        const createOgMeta = (property, content) => {
            const meta = document.createElement('meta');
            meta.setAttribute('property', `og:${property}`);
            meta.content = content;
            document.head.appendChild(meta);
        };

        if (seoData.description) {
            createMeta('description', seoData.description);
        }
        
        if (seoData.og) {
            for (const key in seoData.og) {
                if (seoData.og[key]) {
                    createOgMeta(key, seoData.og[key]);
                }
            }
        }
    }

    // 1. Populate Menus from Data
    function populateMenus() {
        const headerNav = document.getElementById('header-nav');
        const mobileNavList = document.getElementById('mobile-nav-list');
        const mobileNavToggle = document.getElementById('mobile-nav-toggle');
        
        if (!headerNav || !mobileNavList || typeof menuData === 'undefined') return;

        if (menuData.length === 0) {
            if (mobileNavToggle) mobileNavToggle.style.display = 'none';
            return;
        }

        menuData.forEach(item => {
            // Desktop Header Nav
            const navItem = document.createElement('div');
            navItem.className = 'nav-item';
            
            if (item.submenu) {
                navItem.innerHTML = `
                    <button class="nav-link">
                        <i class="${item.icon}"></i>
                        <span>${item.text}</span>
                        <i class="fas fa-chevron-down" style="font-size: 0.75rem; margin-left: 4px;"></i>
                    </button>
                    <div class="nav-dropdown"></div>
                `;
                const dropdown = navItem.querySelector('.nav-dropdown');
                item.submenu.forEach(subItem => {
                    const subLink = document.createElement('a');
                    subLink.href = subItem.link;
                    subLink.target = "showcase";
                    subLink.textContent = subItem.text;
                    subLink.dataset.url = subItem.link;
                    dropdown.appendChild(subLink);
                });
            } else {
                navItem.innerHTML = `<a href="${item.link}" target="showcase" class="nav-link" data-url="${item.link}"><i class="${item.icon}"></i><span>${item.text}</span></a>`;
            }
            headerNav.appendChild(navItem);

            // Mobile Drawer Nav
            const mobileLi = document.createElement('li');
            if (item.submenu) {
                mobileLi.innerHTML = `
                    <button class="mobile-link">
                        <i class="${item.icon}"></i>
                        <span>${item.text}</span>
                        <i class="fas fa-chevron-right mobile-submenu-indicator"></i>
                    </button>
                    <ul class="mobile-submenu"></ul>
                `;
                const submenu = mobileLi.querySelector('.mobile-submenu');
                item.submenu.forEach(subItem => {
                    const subLi = document.createElement('li');
                    subLi.innerHTML = `<a href="${subItem.link}" target="showcase" data-url="${subItem.link}">${subItem.text}</a>`;
                    submenu.appendChild(subLi);
                });
            } else {
                mobileLi.innerHTML = `<a href="${item.link}" target="showcase" class="mobile-link" data-url="${item.link}"><i class="${item.icon}"></i><span>${item.text}</span></a>`;
            }
            mobileNavList.appendChild(mobileLi);
        });
    }

    // 2. Setup Interactions
    function setupInteractions() {
        // Mobile Drawer Toggle
        const toggleBtn = document.getElementById('mobile-nav-toggle');
        const closeBtn = document.getElementById('drawer-close-btn');
        const overlay = document.getElementById('mobile-nav-overlay');
        
        const openDrawer = () => document.body.classList.add('drawer-open');
        const closeDrawer = () => document.body.classList.remove('drawer-open');

        if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (overlay) overlay.addEventListener('click', closeDrawer);

        // Mobile Submenu Toggles
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const nextEl = e.currentTarget.nextElementSibling;
                if (nextEl && nextEl.classList.contains('mobile-submenu')) {
                    e.preventDefault();
                    nextEl.classList.toggle('open');
                    const indicator = e.currentTarget.querySelector('.mobile-submenu-indicator');
                    if (indicator) indicator.classList.toggle('open');
                } else if (e.currentTarget.tagName === 'A') {
                    // Close drawer when a regular link is clicked
                    closeDrawer();
                }
            });
        });

        // Close drawer when mobile submenu links are clicked
        document.querySelectorAll('.mobile-submenu a').forEach(link => {
            link.addEventListener('click', closeDrawer);
        });

        // Handle link clicks to toggle game mode
        document.querySelectorAll('a[target="showcase"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const url = e.currentTarget.getAttribute('href') || e.currentTarget.dataset.url;
                checkGameMode(url);
            });
        });

        // Header Logo click (go home)
        const logo = document.getElementById('header-logo');
        if (logo) {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                showcaseFrame.src = 'pages/games.html';
                checkGameMode('pages/games.html');
            });
        }

        // Desktop Dropdown Toggles (optional, for touch on desktop)
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('button.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('dropdown-open');
                });
            }
            // Close dropdown when mouse leaves
            item.addEventListener('mouseleave', () => {
                item.classList.remove('dropdown-open');
            });
        });
        // Close dropdown when a link inside is clicked
        document.querySelectorAll('.nav-dropdown a').forEach(link => {
            link.addEventListener('click', () => {
                link.closest('.nav-item').classList.remove('dropdown-open');
            });
        });

        // Game FAB Interactions
        const fabBtn = document.getElementById('game-fab-btn');
        const fabPanel = document.getElementById('game-fab-panel');
        const backBtn = document.getElementById('fab-back-btn');

        if (fabBtn && fabPanel) {
            fabBtn.addEventListener('click', () => {
                fabPanel.classList.toggle('hidden');
            });
            
            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!fabBtn.contains(e.target) && !fabPanel.contains(e.target)) {
                    fabPanel.classList.add('hidden');
                }
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                showcaseFrame.src = 'pages/games.html';
                checkGameMode('pages/games.html');
                if (fabPanel) fabPanel.classList.add('hidden');
            });
        }

        // Listen for messages from iframe (e.g., from games.html)
        window.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'NAVIGATE_TO_GAME') {
                const url = e.data.url;
                showcaseFrame.src = url;
                checkGameMode(url);
            }
        });
    }

    // 3. Game Mode Logic
    function checkGameMode(url) {
        if (!url) return;
        
        const isGame = url.includes('games/');
        const fab = document.getElementById('game-fab');
        
        if (isGame) {
            document.body.classList.add('game-mode');
            if (fab) fab.classList.remove('hidden');
        } else {
            document.body.classList.remove('game-mode');
            if (fab) fab.classList.add('hidden');
        }
    }

    // Set initial page
    function setInitialPage() {
        let startUrl = 'pages/games.html';
        if (typeof menuData !== 'undefined' && menuData.length > 0 && menuData[0].link) {
            startUrl = menuData[0].link;
        }
        showcaseFrame.src = startUrl;
        checkGameMode(startUrl);
    }

    // --- Initialize ---
    injectMetadata();
    populateMenus();
    setupInteractions();
    setInitialPage();
});
