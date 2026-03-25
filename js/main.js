// Stagger Entrance Helper
function applyStagger(selector, staggerDelay = 40) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.setProperty('--stagger', index);
        el.style.setProperty('--stagger-delay', `${staggerDelay}ms`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById("themeBtn");
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("drawer");
    const yearEl = document.getElementById("year");

    // Stagger Preparation (Ultra-Snappy)
    applyStagger('.bento-card', 15);
    applyStagger('.timeline-item', 15);
    applyStagger('.pub-item', 10); // Minimal delay for papers

    // Navigation - Scroll Spy
    const navLinks = document.querySelectorAll('.menu a');
    const sections = document.querySelectorAll('section');

    function updateNav() {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNav);
    window.addEventListener('resize', updateNav);
    updateNav(); // Init

    // Magnetic Button Effect
    const magneticBtn = document.querySelector('.hero-btn');
    if (magneticBtn) {
        magneticBtn.addEventListener('mousemove', (e) => {
            const rect = magneticBtn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            magneticBtn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        magneticBtn.addEventListener('mouseleave', () => {
            magneticBtn.style.transform = `translate(0px, 0px)`;
        });
    }

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
            if (!expanded) {
                drawer.style.display = "flex";
                drawer.classList.add('active');
                body.style.overflow = "hidden";
            } else {
                drawer.classList.remove('active');
                setTimeout(() => { drawer.style.display = "none"; }, 400);
                body.style.overflow = "auto";
            }
        });

        const closeBtn = document.getElementById("closeDrawer");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                drawer.classList.remove('active');
                setTimeout(() => { drawer.style.display = "none"; }, 400);
                menuBtn.setAttribute("aria-expanded", "false");
                body.style.overflow = "auto";
            });
        }

        drawer.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                drawer.classList.remove('active');
                setTimeout(() => { drawer.style.display = "none"; }, 400);
                menuBtn.setAttribute("aria-expanded", "false");
                body.style.overflow = "auto";
            });
        });
    }

    // Publication Tabs
    const pubTabs = document.querySelectorAll('.pub-tab');
    const pubPanels = document.querySelectorAll('.pub-panel');

    pubTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;
            pubTabs.forEach(t => t.classList.remove('active'));
            pubPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(target);
            if (panel) {
                panel.classList.add('active');
            }
        });
    });

    // Scroll Reveal Animation (Upgraded)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stagger = parseInt(getComputedStyle(entry.target).getPropertyValue('--stagger') || 0);
                const baseDelay = parseInt(getComputedStyle(entry.target).getPropertyValue('--stagger-delay') || '30ms');
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, stagger * baseDelay);
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll('section, .bento-card, .timeline-item, .pub-item').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // Smooth scroll
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

    // =============================================
    // Analysis & Graphs — Chart.js Integration
    // =============================================
    let chartsInitialized = false;
    let chartInstances = [];

    function getThemeColors() {
        const cs = getComputedStyle(document.body);
        const isDark = document.body.getAttribute('data-theme') !== 'light';
        return {
            text: cs.getPropertyValue('--text').trim() || (isDark ? '#f0f4f8' : '#1a2332'),
            textMuted: cs.getPropertyValue('--text-muted').trim() || (isDark ? '#94a3b8' : '#64748b'),
            textDim: cs.getPropertyValue('--text-dim').trim() || (isDark ? '#64748b' : '#8b97a8'),
            accent: cs.getPropertyValue('--accent').trim() || '#4f8af7',
            border: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
            bg: isDark ? '#0b1220' : '#ffffff',
            isDark
        };
    }

    function destroyCharts() {
        chartInstances.forEach(c => c.destroy());
        chartInstances = [];
    }

    function renderAnalysisCharts() {
        destroyCharts();
        const C = getThemeColors();

        // ---- Color Palettes ----
        const accentRGB = '79,138,247';
        const palette = [
            `rgba(79,138,247,0.85)`,   // Blue
            `rgba(16,185,129,0.85)`,   // Emerald
            `rgba(251,191,36,0.85)`,   // Amber
            `rgba(244,114,182,0.85)`,  // Pink
            `rgba(139,92,246,0.85)`,   // Violet
            `rgba(236,72,153,0.85)`,   // Fuchsia
            `rgba(34,211,238,0.85)`,   // Cyan
            `rgba(251,146,60,0.85)`,   // Orange
        ];

        // ---- Global Chart.js Defaults ----
        Chart.defaults.color = C.textMuted;
        Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.pointStyleWidth = 10;
        Chart.defaults.plugins.legend.labels.padding = 16;
        Chart.defaults.plugins.tooltip.backgroundColor = C.isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)';
        Chart.defaults.plugins.tooltip.titleColor = C.text;
        Chart.defaults.plugins.tooltip.bodyColor = C.textMuted;
        Chart.defaults.plugins.tooltip.borderColor = C.border;
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.tooltip.boxPadding = 6;

        // ==============================
        // 1. Publications per Year — Line Chart
        // ==============================
        const pubYears = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
        const journalsByYear = [2, 1, 2, 0, 2, 0, 4, 6, 3, 4, 4];
        const proceedingsByYear = [0, 2, 0, 2, 1, 0, 4, 2, 1, 1, 0];

        const ctxPubYear = document.getElementById('chartPubYear');
        if (ctxPubYear) {
            const ctx = ctxPubYear.getContext('2d');
            const gradJ = ctx.createLinearGradient(0, 0, 0, 280);
            gradJ.addColorStop(0, `rgba(${accentRGB}, 0.25)`);
            gradJ.addColorStop(1, `rgba(${accentRGB}, 0.01)`);
            const gradP = ctx.createLinearGradient(0, 0, 0, 280);
            gradP.addColorStop(0, 'rgba(16,185,129,0.2)');
            gradP.addColorStop(1, 'rgba(16,185,129,0.01)');

            chartInstances.push(new Chart(ctx, {
                type: 'line',
                data: {
                    labels: pubYears,
                    datasets: [
                        {
                            label: 'Journal Articles',
                            data: journalsByYear,
                            borderColor: `rgba(${accentRGB}, 1)`,
                            backgroundColor: gradJ,
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2.5,
                            pointRadius: 4,
                            pointHoverRadius: 7,
                            pointBackgroundColor: `rgba(${accentRGB}, 1)`,
                            pointBorderColor: C.bg,
                            pointBorderWidth: 2,
                        },
                        {
                            label: 'Proceedings',
                            data: proceedingsByYear,
                            borderColor: 'rgba(16,185,129,0.9)',
                            backgroundColor: gradP,
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2.5,
                            pointRadius: 4,
                            pointHoverRadius: 7,
                            pointBackgroundColor: 'rgba(16,185,129,1)',
                            pointBorderColor: C.bg,
                            pointBorderWidth: 2,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: C.textDim },
                            grid: { color: C.border, drawBorder: false },
                            border: { display: false }
                        },
                        x: {
                            ticks: { color: C.textDim },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: { legend: { position: 'top' } }
                }
            }));
        }

        // ==============================
        // 2. Q-Value Distribution — Doughnut
        // ==============================
        const ctxQ = document.getElementById('chartQDist');
        if (ctxQ) {
            chartInstances.push(new Chart(ctxQ.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Q1 (Scopus)', 'Q2 (Scopus)', 'Other / National'],
                    datasets: [{
                        data: [10, 11, 7],
                        backgroundColor: [
                            `rgba(${accentRGB}, 0.85)`,
                            'rgba(16,185,129,0.85)',
                            'rgba(251,191,36,0.85)'
                        ],
                        borderColor: C.bg,
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '55%',
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                    return ` ${ctx.label}: ${ctx.parsed} papers (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 3. Top Journals — Horizontal Bar
        // ==============================
        const ctxTopJ = document.getElementById('chartTopJournals');
        if (ctxTopJ) {
            chartInstances.push(new Chart(ctxTopJ.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [
                        'J. Air Transport Mgmt.',
                        'The Aeronautical Journal',
                        'Transportation Research Record',
                        'Aerospace',
                        'Energy',
                        'Expert Systems w/ Applications',
                        'Transportation Research Part E'
                    ],
                    datasets: [{
                        label: 'Papers',
                        data: [4, 4, 3, 2, 1, 1, 1],
                        backgroundColor: palette.slice(0, 7),
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.7,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: C.textDim },
                            grid: { color: C.border, drawBorder: false },
                            border: { display: false }
                        },
                        y: {
                            ticks: { color: C.textMuted, font: { size: 11 } },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            }));
        }

        // ==============================
        // 4. Citation Trend — Bar Chart
        // ==============================
        const ctxCit = document.getElementById('chartCitations');
        if (ctxCit) {
            const ctx4 = ctxCit.getContext('2d');
            const gradCit = ctx4.createLinearGradient(0, 0, 0, 280);
            gradCit.addColorStop(0, `rgba(139,92,246,0.7)`);
            gradCit.addColorStop(1, `rgba(139,92,246,0.15)`);

            chartInstances.push(new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026*'],
                    datasets: [{
                        label: 'Citations',
                        data: [6, 6, 12, 22, 38, 51, 63, 103, 25],
                        backgroundColor: gradCit,
                        borderColor: 'rgba(139,92,246,0.9)',
                        borderWidth: 1.5,
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.65,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: C.textDim },
                            grid: { color: C.border, drawBorder: false },
                            border: { display: false }
                        },
                        x: {
                            ticks: { color: C.textDim },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                afterLabel: function (ctx) {
                                    if (ctx.label === '2026*') return '(Partial year)';
                                    return '';
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 5. Cumulative Growth — Area Chart
        // ==============================
        const ctxCum = document.getElementById('chartCumulative');
        if (ctxCum) {
            const ctx5 = ctxCum.getContext('2d');
            const totalByYear = pubYears.map((_, i) => journalsByYear[i] + proceedingsByYear[i]);
            const cumulative = [];
            totalByYear.reduce((sum, val, i) => {
                cumulative[i] = sum + val;
                return cumulative[i];
            }, 0);

            const gradCum = ctx5.createLinearGradient(0, 0, 0, 280);
            gradCum.addColorStop(0, 'rgba(34,211,238,0.3)');
            gradCum.addColorStop(1, 'rgba(34,211,238,0.02)');

            chartInstances.push(new Chart(ctx5, {
                type: 'line',
                data: {
                    labels: pubYears,
                    datasets: [{
                        label: 'Total Publications',
                        data: cumulative,
                        borderColor: 'rgba(34,211,238,0.9)',
                        backgroundColor: gradCum,
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        pointBackgroundColor: 'rgba(34,211,238,1)',
                        pointBorderColor: C.bg,
                        pointBorderWidth: 2,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: C.textDim },
                            grid: { color: C.border, drawBorder: false },
                            border: { display: false }
                        },
                        x: {
                            ticks: { color: C.textDim },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: { legend: { position: 'top' } }
                }
            }));
        }

        // ==============================
        // 6. Publication Type — Doughnut
        // ==============================
        const ctxType = document.getElementById('chartTypeDist');
        if (ctxType) {
            chartInstances.push(new Chart(ctxType.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Journal Articles', 'Conference Proceedings', 'Book Chapters'],
                    datasets: [{
                        data: [28, 13, 1],
                        backgroundColor: [
                            `rgba(${accentRGB}, 0.85)`,
                            'rgba(251,146,60,0.85)',
                            'rgba(244,114,182,0.85)'
                        ],
                        borderColor: C.bg,
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '55%',
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                    return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 7. Project Funding Source — Doughnut
        // ==============================
        const ctxFunding = document.getElementById('chartFundingSource');
        if (ctxFunding) {
            chartInstances.push(new Chart(ctxFunding.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['TÜBİTAK', 'EU Funded', 'University Funded'],
                    datasets: [{
                        data: [4, 1, 4],
                        backgroundColor: [
                            'rgba(251,146,60,0.85)',    // Orange — TÜBİTAK
                            `rgba(${accentRGB}, 0.85)`, // Blue — EU
                            'rgba(16,185,129,0.85)',    // Emerald — University
                        ],
                        borderColor: C.bg,
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '55%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                    return ` ${ctx.label}: ${ctx.parsed} projects (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 8. Project Budget — Horizontal Bar
        // ==============================
        const ctxBudget = document.getElementById('chartProjectBudget');
        if (ctxBudget) {
            chartInstances.push(new Chart(ctxBudget.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: [
                        'ATCOSIMA (EU)',
                        'UAM (TÜBİTAK 1001)',
                        'UAV Deep Learning (1002)',
                        'Turbojet ML (1002)',
                        'ATC Workload (1002)',
                        'Stochastic Prog. (Uni)',
                        'HFACS (Uni)',
                        'ATC Students (Uni)',
                        'Communication (Uni)'
                    ],
                    datasets: [{
                        label: 'Budget',
                        data: [270000, 165000, 100000, 100000, 75000, 25000, 25000, 25000, 25000],
                        backgroundColor: [
                            `rgba(${accentRGB}, 0.85)`,
                            'rgba(251,146,60,0.85)',
                            'rgba(251,146,60,0.70)',
                            'rgba(251,146,60,0.55)',
                            'rgba(251,146,60,0.40)',
                            'rgba(16,185,129,0.85)',
                            'rgba(16,185,129,0.70)',
                            'rgba(16,185,129,0.55)',
                            'rgba(16,185,129,0.40)',
                        ],
                        borderRadius: 6,
                        borderSkipped: false,
                        barPercentage: 0.7,
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                color: C.textDim,
                                callback: function (value) {
                                    if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                                    return value;
                                }
                            },
                            grid: { color: C.border, drawBorder: false },
                            border: { display: false }
                        },
                        y: {
                            ticks: { color: C.textMuted, font: { size: 10 } },
                            grid: { display: false },
                            border: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const idx = ctx.dataIndex;
                                    if (idx === 0) return ` Budget: €${ctx.parsed.x.toLocaleString()} EUR`;
                                    return ` Budget: ₺${ctx.parsed.x.toLocaleString()} TL`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 9. Project Roles — Doughnut
        // ==============================
        const ctxRoles = document.getElementById('chartProjectRoles');
        if (ctxRoles) {
            chartInstances.push(new Chart(ctxRoles.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['PI', 'Researcher', 'Scholar'],
                    datasets: [{
                        data: [1, 7, 1],
                        backgroundColor: [
                            'rgba(139,92,246,0.85)',    // Violet — PI
                            `rgba(${accentRGB}, 0.85)`, // Blue — Researcher
                            'rgba(251,191,36,0.85)',    // Amber — Scholar
                        ],
                        borderColor: C.bg,
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '55%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                    return ` ${ctx.label}: ${ctx.parsed} projects (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        // ==============================
        // 10. Authorship Distribution — Doughnut
        // ==============================
        const ctxAuth = document.getElementById('chartAuthorship');
        if (ctxAuth) {
            chartInstances.push(new Chart(ctxAuth.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['First+Single Author', 'Co-Author'],
                    datasets: [{
                        data: [27, 14],
                        backgroundColor: [
                            `rgba(${accentRGB}, 0.85)`,
                            'rgba(16,185,129,0.85)',
                        ],
                        borderColor: C.bg,
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '55%',
                    plugins: {
                        legend: { position: 'bottom' },
                        tooltip: {
                            callbacks: {
                                label: function (ctx) {
                                    const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                    return ` ${ctx.label}: ${ctx.parsed} papers (${pct}%)`;
                                }
                            }
                        }
                    }
                }
            }));
        }

        chartsInitialized = true;
    }

    // Expose for PDF Generation
    window.renderAnalysisCharts = renderAnalysisCharts;

    // Lazy init: render charts when the "Analysis & Graphs" tab is clicked
    pubTabs.forEach(tab => {
        if (tab.dataset.target === 'analysis') {
            tab.addEventListener('click', () => {
                if (!chartsInitialized) {
                    // Small delay to let the panel become visible
                    setTimeout(renderAnalysisCharts, 80);
                }
            });
        }
    });

    // Re-render charts when theme changes
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (chartsInitialized) {
                setTimeout(renderAnalysisCharts, 100);
            }
        });
    }
});
