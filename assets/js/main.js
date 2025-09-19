document.addEventListener('DOMContentLoaded', () => {
    const showcaseFrame = document.querySelector('iframe[name="showcase"]');
    let sidebar, toggleBtn, mobileMenuBtn, overlay;

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
                if (seoData.og[key]) { // Only add if content exists
                    createOgMeta(key, seoData.og[key]);
                }
            }
        }
    }

    // 1. Create All UI Elements
    function createUI() {
        const sidebarContainer = document.getElementById('sidebar-container');
        // Mobile-only elements
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.id = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
        document.body.appendChild(mobileMenuBtn);

        overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);

        // Sidebar structure
        const sidebarDiv = document.createElement('div');
        sidebarDiv.id = 'sidebar';
        sidebarDiv.innerHTML = `
            <div class="sidebar-header">
                <h2>Sanhue0302</h2>
                <button id="toggle-btn"><i class="fas fa-chevron-left"></i></button>
            </div>
            <ul id="sidebar-nav"></ul>
        `;
        sidebarContainer.appendChild(sidebarDiv);

        // Assign global vars
        sidebar = document.getElementById('sidebar');
        toggleBtn = document.getElementById('toggle-btn');

        populateMenu();
        setupInteractions();
    }

    // 2. Populate Menu from Data
    function populateMenu() {
        const nav = document.getElementById('sidebar-nav');
        if (!nav || typeof menuData === 'undefined') return;

        menuData.forEach(item => {
            const li = document.createElement('li');
            if (item.submenu) {
                li.innerHTML = `
                    <div class="menu-toggle">
                        <i class="${item.icon} icon"></i>
                        <span class="link-text">${item.text}</span>
                        <i class="fas fa-chevron-right submenu-indicator"></i>
                    </div>
                    <ul class="submenu"></ul>
                `;
                const submenuUl = li.querySelector('.submenu');
                item.submenu.forEach(subItem => {
                    const subLi = document.createElement('li');
                    subLi.innerHTML = `<a href="${subItem.link}" target="showcase">${subItem.text}</a>`;
                    submenuUl.appendChild(subLi);
                });
            } else {
                li.innerHTML = `<a href="${item.link}" target="showcase"><i class="${item.icon} icon"></i><span class="link-text">${item.text}</span></a>`;
            }
            nav.appendChild(li);
        });
    }

    // 3. Setup All Interactions
    function setupInteractions() {
        const toggleBtnIcon = toggleBtn.querySelector('i');

        // Sidebar toggle button (for both mobile and desktop)
        toggleBtn.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                document.body.classList.remove('sidebar-open');
            } else {
                sidebar.classList.toggle('collapsed');
                if (sidebar.classList.contains('collapsed')) {
                    closeAllSubmenus();
                    toggleBtnIcon.classList.replace('fa-chevron-left', 'fa-bars');
                } else {
                    toggleBtnIcon.classList.replace('fa-bars', 'fa-chevron-left');
                }
            }
        });

        // Mobile hamburger button
        mobileMenuBtn.addEventListener('click', () => document.body.classList.add('sidebar-open'));
        
        // Overlay closes the sidebar
        overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));

        // Submenu toggles
        document.querySelectorAll('.menu-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (sidebar.classList.contains('collapsed')) return;
                const submenu = e.currentTarget.nextElementSibling;
                const indicator = e.currentTarget.querySelector('.submenu-indicator');
                submenu.classList.toggle('open');
                indicator.classList.toggle('open');
            });
        });

        // Close mobile sidebar when a link is clicked
        document.querySelectorAll('#sidebar-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) { // Only on mobile
                    document.body.classList.remove('sidebar-open');
                }
            });
        });
    }

    function closeAllSubmenus() {
        document.querySelectorAll('.submenu').forEach(sm => sm.classList.remove('open'));
        document.querySelectorAll('.submenu-indicator').forEach(ind => ind.classList.remove('open'));
    }

    // Set initial page
    function setInitialPage() {
        if (typeof menuData !== 'undefined' && menuData.length > 0 && menuData[0].link) {
            showcaseFrame.src = menuData[0].link;
        } else {
            showcaseFrame.src = 'pages/home.html'; // Default to home
        }
    }

    // --- Initialize ---
    injectMetadata();
    createUI();
    setInitialPage();
});
