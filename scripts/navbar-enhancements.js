<script>
(() => {
  // --- Search Shortcut Utilities ---
  const isTypingTarget = (element) => {
    if (!element) return false;
    const tagName = element.tagName?.toLowerCase();
    return (
      element.isContentEditable ||
      ["input", "select", "textarea", "button", "option"].includes(tagName)
    );
  };

  const openSearch = () => {
    if (typeof window.quartoOpenSearch === "function") {
      window.quartoOpenSearch();
      return;
    }
    document.querySelector("#quarto-search button, #quarto-search")?.click();
  };

  document.addEventListener("keydown", (event) => {
    const isSearchShortcut =
      event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

    if (!isSearchShortcut || isTypingTarget(document.activeElement)) return;

    event.preventDefault();
    openSearch();
  });

  const addShortcutLabel = () => {
    const search = document.querySelector("#quarto-search");
    if (!search || search.querySelector(".search-shortcut-label")) return;

    search.classList.add("search-shortcut-button");

    const label = document.createElement("span");
    label.className = "search-shortcut-label";
    label.setAttribute("aria-hidden", "true");
    label.textContent = "⌘K";

    search.appendChild(label);
    search?.setAttribute("title", "Search (⌘K)");
    search?.setAttribute("aria-label", "Search (Command K)");
  };

  const bindSearchContainer = () => {
    const search = document.querySelector("#quarto-search");
    if (!search || search.dataset.shortcutBound === "true") return;

    search.dataset.shortcutBound = "true";
    search.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openSearch();
    });
  };

  // --- Dark Mode / Theme Toggle Toggler ---
  const syncThemeIcons = (newTheme) => {
    const navIcon = document.querySelector('.theme-toggle-btn i');
    if (navIcon) {
      navIcon.className = newTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    }
    const sidebarIcon = document.querySelector('.sidebar-custom-theme-toggle i');
    if (sidebarIcon) {
      sidebarIcon.className = newTheme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    }
  };

  const setupThemeToggle = () => {
    const search = document.querySelector("#quarto-search");
    if (!search) return;

    const navbarContainer = search.closest(".navbar-container");
    if (!navbarContainer) return;

    let controls = navbarContainer.querySelector(":scope > .navbar-utility-controls");
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "navbar-utility-controls";
      navbarContainer.appendChild(controls);
    }

    if (search.parentNode !== controls) {
      controls.appendChild(search);
    }

    if (controls.querySelector(".theme-toggle-btn")) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "theme-toggle-btn";
    toggleBtn.setAttribute("aria-label", "Toggle theme");
    toggleBtn.setAttribute("title", "Toggle dark/light mode");

    const icon = document.createElement("i");
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    toggleBtn.appendChild(icon);

    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.setAttribute("data-bs-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      
      syncThemeIcons(newTheme);
    });

    controls.insertBefore(toggleBtn, search);
  };

  // --- Sidebar Custom Premium Header ---
  const getCoursePageLang = () => {
    const path = normalizeSitePath(window.location.pathname);
    if (/(^|-)vi\/index\.html$/.test(path) || path.endsWith('index-vi.html')) return 'vi';
    if (/(^|-)ja\/index\.html$/.test(path) || path.endsWith('index-ja.html')) return 'ja';
    return 'en';
  };

  const normalizeSitePath = (path) => {
    let nextPath = path.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '');
    if (nextPath.endsWith('/')) nextPath += 'index.html';
    if (!nextPath.endsWith('.html')) nextPath += '.html';
    return nextPath;
  };

  const isCourseAreaPage = () => {
    const path = normalizeSitePath(window.location.pathname);
    return path.startsWith('courses/linear-algebra/') ||
      /^posts\/.*linear-algebra-pt.*-(en|vi|ja)\/index\.html$/.test(path);
  };

  const localizePath = (path, targetLang) => {
    const normalized = normalizeSitePath(path);
    const coursePaths = {
      en: 'courses/linear-algebra/index.html',
      vi: 'courses/linear-algebra/index-vi.html',
      ja: 'courses/linear-algebra/index-ja.html'
    };

    if (normalized.startsWith('courses/linear-algebra/')) {
      return coursePaths[targetLang];
    }

    if (normalized.startsWith('posts/')) {
      const withoutLang = normalized.replace(/-(en|vi|ja)\/index\.html$/, '');
      return `${withoutLang}-${targetLang}/index.html`;
    }

    return coursePaths[targetLang];
  };

  const setupCoursePageToc = () => {
    if (!isCourseAreaPage()) return;

    document.body.classList.add('course-layout-page');

    const content = document.querySelector('#quarto-document-content');
    const margin = document.querySelector('#quarto-margin-sidebar');
    if (!content || !margin) return;

    let toc = margin.querySelector('#TOC');
    if (!toc) {
      toc = document.createElement('nav');
      toc.id = 'TOC';
      toc.setAttribute('role', 'doc-toc');
      margin.appendChild(toc);
    }

    const lang = getCoursePageLang();
    const fallbackLabels = {
      en: { intro: 'Introduction', chapters: 'Chapters' },
      vi: { intro: 'Giới thiệu', chapters: 'Chương trình' },
      ja: { intro: '紹介', chapters: 'チャプター' }
    };

    const ensureId = (element, fallbackId) => {
      if (!element.id) element.id = fallbackId;
      return element.id;
    };

    let items = [...content.querySelectorAll('h1[id]:not(.title), h2[id], h3[id], h1:not(.title), h2, h3')]
      .filter((heading) => heading.offsetParent !== null)
      .map((heading, index) => ({
        id: ensureId(heading, `course-heading-${index + 1}`),
        text: heading.textContent.trim(),
        level: heading.tagName.toLowerCase()
      }))
      .filter((item) => item.text);

    if (!items.length) {
      const labels = fallbackLabels[lang] || fallbackLabels.en;
      const intro = content.querySelector('#course-intro');
      const listing = content.querySelector('#listing-listing');
      const title = content.querySelector('h1.title');
      const currentPath = normalizeSitePath(document.body.dataset.courseCurrentPath || window.location.pathname);
      const isChapterPage = currentPath.startsWith('posts/');
      if (title && !title.id) title.id = isChapterPage ? 'chapter-title' : 'course-overview';
      items = [
        intro && { id: intro.id, text: labels.intro, level: 'h2' },
        !intro && title && { id: title.id, text: isChapterPage ? title.textContent.trim() : labels.intro, level: 'h2' },
        listing && { id: listing.id, text: labels.chapters, level: 'h2' }
      ].filter(Boolean);
    }

    if (!items.length) {
      toc.hidden = true;
      return;
    }

    toc.hidden = false;
    toc.removeAttribute('style');
    const title = toc.querySelector('#toc-title') || document.createElement('h2');
    title.id = 'toc-title';
    title.textContent = 'On this page';
    const list = document.createElement('ul');
    list.innerHTML = items.map((item) => `
      <li class="${item.level === 'h3' ? 'depth-2' : 'depth-1'}">
        <a href="#${item.id}" class="nav-link" data-scroll-target="#${item.id}">${item.text}</a>
      </li>
    `).join('');
    toc.replaceChildren(title, list);

    window.__courseTocCleanup?.();

    const links = [...list.querySelectorAll('a')];
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        const targetId = decodeURIComponent(link.hash.replace(/^#/, ''));
        link.classList.toggle('active', targetId === id);
      });
    };

    const updateActiveTocLink = () => {
      if (!targets.length) return;

      const activationLine = Math.min(window.innerHeight * 0.28, 220);
      let activeTarget = targets[0];

      for (const target of targets) {
        if (target.getBoundingClientRect().top <= activationLine) {
          activeTarget = target;
        }
      }

      setActive(activeTarget.id);
    };

    links.forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = decodeURIComponent(link.hash.replace(/^#/, ''));
        setActive(targetId);
      });
    });

    window.addEventListener('scroll', updateActiveTocLink, { passive: true });
    window.addEventListener('resize', updateActiveTocLink);
    window.addEventListener('hashchange', updateActiveTocLink);
    window.__courseTocCleanup = () => {
      window.removeEventListener('scroll', updateActiveTocLink);
      window.removeEventListener('resize', updateActiveTocLink);
      window.removeEventListener('hashchange', updateActiveTocLink);
    };
    requestAnimationFrame(updateActiveTocLink);
  };

  const setupCustomSidebarHeader = () => {
    if (!isCourseAreaPage()) return;

    const menuContainer = document.querySelector('#quarto-sidebar .sidebar-menu-container');
    if (!menuContainer) return;
    if (menuContainer.querySelector('.sidebar-custom-header')) return;

    // Detect page path and language
    let path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
    const dirMatch = path.match(/^(\/courses\/[^\/]+)$/);
    if (dirMatch) path = dirMatch[1] + '/index';

    const currentLang = getCoursePageLang();

    // Get site offset relative prefix
    const offset = document.querySelector('meta[name="quarto:offset"]')?.getAttribute('content') || '';

    // Translation maps
    const courseTitles = {
      en: 'Linear Algebra',
      vi: 'Đại số tuyến tính',
      ja: '線形代数'
    };

    const searchPlaceholders = {
      en: 'Search',
      vi: 'Tìm kiếm',
      ja: '検索'
    };

    const dropdownLabels = {
      en: { course: 'Linear Algebra' },
      vi: { course: 'Đại số tuyến tính' },
      ja: { course: '線形代数' }
    };

    const coursePaths = {
      en: 'courses/linear-algebra/index.html',
      vi: 'courses/linear-algebra/index-vi.html',
      ja: 'courses/linear-algebra/index-ja.html'
    };

    document.body.dataset.courseCurrentPath = normalizeSitePath(window.location.pathname);

    const customHeader = document.createElement('div');
    customHeader.className = 'sidebar-custom-header';

    // 1. Course Dropdown Selector
    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.className = 'sidebar-course-dropdown';

    const dropdownBtn = document.createElement('button');
    dropdownBtn.className = 'sidebar-course-dropdown-btn';
    
    const square = document.createElement('span');
    square.className = 'dropdown-square-bullet';
    
    const titleText = document.createElement('span');
    titleText.className = 'dropdown-title-text';
    titleText.textContent = courseTitles[currentLang];

    const chevron = document.createElement('i');
    chevron.className = 'bi bi-chevron-down';

    dropdownBtn.appendChild(square);
    dropdownBtn.appendChild(titleText);
    dropdownBtn.appendChild(chevron);
    dropdownWrapper.appendChild(dropdownBtn);

    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'sidebar-course-dropdown-content';

    const linkCourse = document.createElement('a');
    linkCourse.href = offset + coursePaths[currentLang];
    linkCourse.textContent = dropdownLabels[currentLang].course;
    linkCourse.className = 'active';

    dropdownContent.appendChild(linkCourse);
    dropdownWrapper.appendChild(dropdownContent);

    // Toggle dropdown
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownWrapper.classList.toggle('show');
    });

    // Close on click outside
    document.addEventListener('click', () => {
      dropdownWrapper.classList.remove('show');
    });

    // 2. Search box trigger
    const searchTrigger = document.createElement('div');
    searchTrigger.className = 'sidebar-custom-search';
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'bi bi-search';

    const searchPlaceholder = document.createElement('span');
    searchPlaceholder.className = 'sidebar-search-placeholder';
    searchPlaceholder.textContent = searchPlaceholders[currentLang];

    const searchShortcut = document.createElement('span');
    searchShortcut.className = 'sidebar-search-badge';
    searchShortcut.textContent = '⌘K';

    searchTrigger.appendChild(searchIcon);
    searchTrigger.appendChild(searchPlaceholder);
    searchTrigger.appendChild(searchShortcut);

    searchTrigger.addEventListener('click', () => {
      openSearch();
    });

    // 3. Language Selector
    const langSelectWrapper = document.createElement('div');
    langSelectWrapper.className = 'sidebar-custom-lang';
    
    const langSelect = document.createElement('select');
    langSelect.className = 'sidebar-custom-lang-select';

    const langOptions = {
      en: { label: 'EN' },
      vi: { label: 'VI' },
      ja: { label: 'JA' }
    };

    for (const [code, { label }] of Object.entries(langOptions)) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = label;
      if (code === currentLang) opt.selected = true;
      langSelect.appendChild(opt);
    }
    langSelect.addEventListener('change', (e) => {
      const currentPath = document.body.dataset.courseCurrentPath || window.location.pathname;
      window.location.href = offset + localizePath(currentPath, e.target.value);
    });
    langSelectWrapper.appendChild(langSelect);

    // Assembly
    const divider = document.createElement('div');
    divider.className = 'sidebar-custom-divider';

    customHeader.appendChild(dropdownWrapper);
    customHeader.appendChild(searchTrigger);
    customHeader.appendChild(langSelectWrapper);
    customHeader.appendChild(divider);

    // Prepend to menuContainer
    menuContainer.insertBefore(customHeader, menuContainer.firstChild);

    // Highlight active link based on current pathname
    const allLinks = menuContainer.querySelectorAll('a.sidebar-link');
    allLinks.forEach(link => {
      link.classList.remove('course-active');
      link.closest('.sidebar-item')?.classList.remove('course-active');
      let href = link.getAttribute('href');
      if (!href) return;
      // Resolve href to absolute-like path
      const a = document.createElement('a');
      a.href = href;
      const currentPath = normalizeSitePath(window.location.pathname);
      const isCourseOverview = currentPath === 'courses/linear-algebra/index.html' ||
        currentPath === 'courses/linear-algebra/index-vi.html' ||
        currentPath === 'courses/linear-algebra/index-ja.html';
      const isOverviewLink = a.hash === '#course-overview';
      const isCurrentPageLink = normalizeSitePath(a.pathname) === currentPath && !isOverviewLink;
      if ((isCourseOverview && isOverviewLink) || isCurrentPageLink) {
        link.closest('.sidebar-item')?.classList.add('course-active');
        link.classList.add('course-active');
      }
    });
  };

  const setupCourseBreadcrumbs = () => {
    if (!isCourseAreaPage()) return;

    const lang = getCoursePageLang();
    const coursePaths = {
      en: 'courses/linear-algebra/index.html',
      vi: 'courses/linear-algebra/index-vi.html',
      ja: 'courses/linear-algebra/index-ja.html'
    };
    const sectionLabels = {
      en: 'Chapters',
      vi: 'Chương trình',
      ja: 'チャプター'
    };
    const offset = document.querySelector('meta[name="quarto:offset"]')?.getAttribute('content') || '';
    const courseHref = offset + coursePaths[lang] + '#course-chapters';

    document.querySelectorAll('.quarto-page-breadcrumbs .breadcrumb-item a').forEach((link) => {
      const text = link.textContent.trim();
      if (text === sectionLabels[lang] || text === 'Chapters' || text === 'Chương trình' || text === 'チャプター') {
        link.href = courseHref;
      }
    });
  };

  const setupCourseChapterPager = () => {
    if (!isCourseAreaPage()) return;

    const content = document.querySelector('#quarto-document-content');
    const sidebar = document.querySelector('#quarto-sidebar');
    if (!content || !sidebar) return;

    content.querySelector('.course-chapter-pager')?.remove();

    const currentPath = normalizeSitePath(document.body.dataset.courseCurrentPath || window.location.pathname);
    const coursePaths = {
      en: 'courses/linear-algebra/index.html',
      vi: 'courses/linear-algebra/index-vi.html',
      ja: 'courses/linear-algebra/index-ja.html'
    };
    const isOverviewPage = Object.values(coursePaths).includes(currentPath);
    const isChapterPage = currentPath.startsWith('posts/');
    if (!isOverviewPage && !isChapterPage) return;

    const chapters = [...sidebar.querySelectorAll('.sidebar-section .sidebar-item')]
      .map((item) => {
        const link = item.querySelector('a.sidebar-link[href]');
        const text = (link || item.querySelector('.menu-text'))?.textContent.trim();
        if (!text || !/^\d+\./.test(text)) return null;

        let href = link?.getAttribute('href') || '';
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          href = a.href;
        }

        return { text, href, path: href ? normalizeSitePath(new URL(href).pathname) : '' };
      })
      .filter(Boolean);

    const lang = getCoursePageLang();
    const labels = {
      en: { previous: 'Previous chapter', next: 'Next chapter', start: 'Start course' },
      vi: { previous: 'Bài trước', next: 'Bài tiếp theo', start: 'Bắt đầu khóa học' },
      ja: { previous: '前のチャプター', next: '次のチャプター', start: 'コースを開始' }
    }[lang] || { previous: 'Previous chapter', next: 'Next chapter', start: 'Start course' };

    const renderItem = (chapter, direction, label) => {
      if (!chapter) return '<span class="course-pager-spacer" aria-hidden="true"></span>';

      const body = `
        <span class="course-pager-label">${label}</span>
        <span class="course-pager-title">${chapter.text}</span>
      `;

      if (!chapter.href) {
        return `<span class="course-pager-item ${direction} disabled" aria-disabled="true">${body}</span>`;
      }

      return `<a class="course-pager-item ${direction}" href="${chapter.href}">${body}</a>`;
    };

    const pager = document.createElement('nav');
    pager.className = 'course-chapter-pager';
    pager.setAttribute('aria-label', 'Chapter navigation');

    if (isOverviewPage) {
      pager.innerHTML = [
        '<span class="course-pager-spacer" aria-hidden="true"></span>',
        renderItem(chapters[0], 'next', labels.start)
      ].join('');
    } else {
      const currentIndex = chapters.findIndex((chapter) => chapter.path === currentPath);
      if (currentIndex === -1) return;
      pager.innerHTML = [
        renderItem(chapters[currentIndex - 1], 'previous', labels.previous),
        renderItem(chapters[currentIndex + 1], 'next', labels.next)
      ].join('');
    }

    content.appendChild(pager);
  };

  // --- Sidebar Chapter Navigation (SPA-style) ---
  const setupSidebarChapterNav = () => {
    const sidebar = document.querySelector('#quarto-sidebar');
    if (!sidebar) return;
    if (sidebar.dataset.chapterNavBound === 'true') {
      setupCoursePageToc();
      return;
    }
    sidebar.dataset.chapterNavBound = 'true';

    const links = sidebar.querySelectorAll('.sidebar-section a.sidebar-link[href]');
    if (!links.length) return;

    const content = document.querySelector('#quarto-document-content');
    if (!content) return;

    let savedHtml = null;

    const backBtn = document.createElement('a');
    backBtn.href = '#';
    backBtn.className = 'course-back-btn';
    backBtn.textContent = '← Back to course';
    backBtn.style.display = 'none';
    backBtn.style.cursor = 'pointer';
    content.parentNode.insertBefore(backBtn, content);

    const showOverview = (e) => {
      if (e) e.preventDefault();
      document.body.dataset.courseCurrentPath = localizePath(window.location.pathname, getCoursePageLang());
      if (savedHtml) {
        content.innerHTML = savedHtml;
        savedHtml = null;
        backBtn.style.display = 'none';
        links.forEach(l => {
          l.closest('.sidebar-item')?.classList.remove('course-active');
          l.classList.remove('course-active');
        });
        const overviewLink = [...links].find(l => {
          const a = document.createElement('a');
          a.href = l.getAttribute('href') || '';
          return a.hash === '#course-overview';
        });
        overviewLink?.closest('.sidebar-item')?.classList.add('course-active');
        overviewLink?.classList.add('course-active');
        setupCoursePageToc();
      }
      const intro = document.querySelector('#course-intro');
      if (intro) intro.scrollIntoView({ behavior: 'smooth' });
    };

    const loadChapter = async (e) => {
      const link = e.currentTarget;
      let href = link.getAttribute('href');
      if (!href) return;
      e.preventDefault();

      // Handle intro links (href could be #intro or ../../#intro after resolution)
      const aEl = document.createElement('a');
      aEl.href = href;
      if (aEl.hash === '#course-overview') {
        if (normalizeSitePath(window.location.pathname).startsWith('posts/')) {
          const offset = document.querySelector('meta[name="quarto:offset"]')?.getAttribute('content') || '';
          const coursePaths = {
            en: 'courses/linear-algebra/index.html',
            vi: 'courses/linear-algebra/index-vi.html',
            ja: 'courses/linear-algebra/index-ja.html'
          };
          window.location.href = offset + coursePaths[getCoursePageLang()] + '#course-overview';
          return;
        }
        showOverview();
        return;
      }

      // Normalize URL: replace .qmd → .html, fix protocol-relative //
      href = href.replace(/\.qmd$/, '.html').replace(/^\/\//, '/');
      const a = document.createElement('a');
      a.href = href;
      href = a.href;
      document.body.dataset.courseCurrentPath = normalizeSitePath(a.pathname);

      links.forEach(l => {
        l.closest('.sidebar-item')?.classList.remove('course-active');
        l.classList.remove('course-active');
      });
      link.closest('.sidebar-item')?.classList.add('course-active');
      link.classList.add('course-active');

      if (!savedHtml) savedHtml = content.innerHTML;
      backBtn.style.display = 'inline-block';
      content.innerHTML = '<p class="course-loading">Loading…</p>';

      try {
        const res = await fetch(href);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newContent = doc.querySelector('#quarto-document-content');
        if (newContent) {
          content.innerHTML = newContent.innerHTML;
          setupCoursePageToc();
          setupCourseChapterPager();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch {
        content.innerHTML = '<p style="color:red">Failed to load chapter.</p>';
      }
    };

    links.forEach(link => link.addEventListener('click', loadChapter));
    backBtn.addEventListener('click', showOverview);
  };

  // --- Initializers ---
  window.addEventListener("DOMContentLoaded", () => {
    addShortcutLabel();
    bindSearchContainer();
    setupThemeToggle();
    setupCustomSidebarHeader();
    setupCoursePageToc();
    setupCourseBreadcrumbs();
    setupCourseChapterPager();
    setupSidebarChapterNav();

    const search = document.querySelector("#quarto-search");
    if (!search) return;

    const observer = new MutationObserver(() => {
      addShortcutLabel();
      setupThemeToggle();
    });
    observer.observe(search, { childList: true, subtree: true });
  });

  addShortcutLabel();
  bindSearchContainer();
  setupThemeToggle();
  setupCustomSidebarHeader();
  setupCoursePageToc();
  setupCourseBreadcrumbs();
  setupCourseChapterPager();
  setupSidebarChapterNav();
})();
</script>
