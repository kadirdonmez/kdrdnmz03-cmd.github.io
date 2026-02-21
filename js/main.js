// -----------------------------
// Kadir Dönmez - Main Interactive Logic
// (Same architecture as DARE Lab)
// -----------------------------

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById("themeBtn");
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("drawer");
    const yearEl = document.getElementById("year");

    // Set current year in footer
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Theme Management
    const savedTheme = localStorage.getItem("kd_theme");
    if (savedTheme) {
        body.setAttribute("data-theme", savedTheme);
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("kd_theme", newTheme);
        });
    }

    // Mobile Menu Toggle
    if (menuBtn && drawer) {
        menuBtn.addEventListener("click", () => {
            const expanded = menuBtn.getAttribute("aria-expanded") === "true";
            menuBtn.setAttribute("aria-expanded", String(!expanded));
            drawer.style.display = expanded ? "none" : "block";
        });

        const closeBtn = document.getElementById("closeDrawer");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                drawer.style.display = "none";
                menuBtn.setAttribute("aria-expanded", "false");
            });
        }

        // Close drawer when clicking a link
        drawer.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                drawer.style.display = "none";
                menuBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Publication Tabs
    const pubTabs = document.querySelectorAll('.pub-tab');
    const pubPanels = document.querySelectorAll('.pub-panel');

    pubTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;

            // Deactivate all tabs and panels
            pubTabs.forEach(t => t.classList.remove('active'));
            pubPanels.forEach(p => p.classList.remove('active'));

            // Activate clicked tab and target panel
            tab.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    // Scroll Reveal Animation
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('section, .bento-card, .timeline-item').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
