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
      localStorage.setItem("theme", newTheme);
      
      icon.className = newTheme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
    });

    controls.insertBefore(toggleBtn, search);
  };

  // --- Initializers ---
  window.addEventListener("DOMContentLoaded", () => {
    addShortcutLabel();
    bindSearchContainer();
    setupThemeToggle();

    const search = document.querySelector("#quarto-search");
    if (!search) return;

    const observer = new MutationObserver(() => {
      addShortcutLabel();
      setupThemeToggle();
    });
    observer.observe(search, { childList: true, subtree: true });
  });

  // Run immediately in case script is loaded deferred or DOM is already ready
  addShortcutLabel();
  bindSearchContainer();
  setupThemeToggle();
})();
</script>
