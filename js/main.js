// ============================================================
// PREMIUM INTERACTIONS — Kadir Dönmez Academic Portfolio
// Aircraft motion, Scroll Progress, Counters, Card Effects
// ============================================================

// ---- Hero Aircraft System ----
function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let aircraft = [];
    let animFrame;

    function resize() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createAircraft(startOffscreen = false) {
        const size = Math.random() * 9 + 11;
        const speed = Math.random() * 0.35 + 0.22;
        const angle = (Math.random() * 0.18) - 0.08;

        return {
            x: startOffscreen ? -80 - Math.random() * canvas.width : Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size,
            speedX: speed,
            speedY: (Math.random() - 0.5) * 0.08 - 0.03,
            angle,
            opacity: Math.random() * 0.32 + 0.18,
            phase: Math.random() * Math.PI * 2,
            phaseSpeed: Math.random() * 0.012 + 0.006,
            trail: Math.random() * 24 + 54
        };
    }

    function init() {
        resize();
        const count = Math.min(Math.max(Math.floor(canvas.width * canvas.height / 48000), 10), 24);
        aircraft = [];
        for (let i = 0; i < count; i++) aircraft.push(createAircraft());
    }

    function drawAircraftIcon(p, alpha) {
        const wave = Math.sin(p.phase);
        const rotation = p.angle + wave * 0.045;
        const scale = p.size / 18;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);

        ctx.beginPath();
        ctx.moveTo(19, 0);
        ctx.lineTo(-13, -7);
        ctx.lineTo(-7, -1);
        ctx.lineTo(-15, 4);
        ctx.lineTo(-10, 7);
        ctx.lineTo(-1, 2);
        ctx.lineTo(19, 0);
        ctx.closePath();
        ctx.fillStyle = `rgba(37, 99, 235, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-7, -1);
        ctx.lineTo(-2, 2);
        ctx.strokeStyle = `rgba(219, 234, 254, ${alpha * 0.75})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
    }

    function drawTrail(p, alpha) {
        const trailStartX = p.x - p.trail;
        const trailY = p.y + 1;
        const gradient = ctx.createLinearGradient(trailStartX, trailY, p.x - 12, p.y);
        gradient.addColorStop(0, `rgba(79, 138, 247, 0)`);
        gradient.addColorStop(1, `rgba(79, 138, 247, ${alpha * 0.22})`);

        ctx.beginPath();
        ctx.moveTo(trailStartX, trailY);
        ctx.lineTo(p.x - 14, p.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(0.7, p.size / 18);
        ctx.stroke();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        aircraft.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY + Math.sin(p.phase) * 0.035;
            p.phase += p.phaseSpeed;

            if (p.x > canvas.width + 80 || p.y < -60 || p.y > canvas.height + 60) {
                Object.assign(p, createAircraft(true));
                p.y = Math.random() * canvas.height;
            }

            const shimmer = (Math.sin(p.phase) + 1) / 2;
            const alpha = p.opacity * (0.78 + shimmer * 0.22);
            drawTrail(p, alpha);
            drawAircraftIcon(p, alpha);
        });

        animFrame = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', init);

    const heroObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { if (!animFrame) draw(); }
            else { cancelAnimationFrame(animFrame); animFrame = null; }
        });
    }, { threshold: 0 });
    heroObs.observe(canvas.parentElement);
}

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
    const brandLabel = document.querySelector('.brand span');
    const closeDrawerBtn = document.getElementById("closeDrawer");

    if (brandLabel) {
        brandLabel.textContent = 'KADIR DONMEZ';
    }

    if (menuBtn) {
        menuBtn.innerHTML = '&#9776;';
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.innerHTML = '&#10005;';
    }

    document.querySelectorAll('a[href="#papers"]').forEach(link => {
        link.textContent = 'Publications';
    });

    document.querySelectorAll('a[href="#labs"]').forEach(link => {
        link.textContent = 'Labs & Groups';
    });

    // Stagger Preparation (Ultra-Snappy)
    applyStagger('.bento-card', 15);
    applyStagger('.timeline-item', 15);
    applyStagger('.pub-item', 10);

    // Init Particles
    initParticles();

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scrollProgress');
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

    // Combined scroll handler
    function onScroll() {
        updateNav();
        // Update scroll progress
        if (scrollProgress) {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
    onScroll();

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
    body.setAttribute("data-theme", "light");
    localStorage.setItem("kd_theme", "light");
    if (themeBtn) {
        themeBtn.remove();
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

    function syncProjectContent() {
        const projectCards = Array.from(document.querySelectorAll('#projects .bento-card'));

        projectCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent?.trim() || '';
            const label = card.querySelector('.label');
            const description = card.querySelector('p');
            let budget = card.querySelector('.project-budget');

            if (title === 'Discover Air Traffic Management: Hands-on Air Traffic Control Simulation Program') {
                if (!budget) {
                    budget = document.createElement('div');
                    budget.className = 'project-budget';
                    card.appendChild(budget);
                }
                budget.textContent = '450.000 TL';
            }

            if (title === 'UAV-Assisted Deep Learning for Multi-Damage Detection in Aircraft') {
                if (label) {
                    label.textContent = 'TUBITAK 1002 - 2025-2026';
                }
                if (description) {
                    description.textContent = 'PI: Kadir Donmez - with Suat Toraman, Hakan Aygun, Omer Osman Dursun. Apr 2025 - 2026.';
                }
            }
        });
    }
    syncProjectContent();

    function syncAcademicProfileContent() {
        const bioParagraphs = document.querySelectorAll('#about .bio-more p');
        if (bioParagraphs.length >= 6) {
            bioParagraphs[3].textContent = "Since 2022, I have been actively teaching a range of undergraduate and graduate courses. These include Basic Aircraft Knowledge and Basic Aerodynamics for undergraduate students in the Department of Aircraft Maintenance, as well as Aerospace Instruments for students in Aeronautics and Astronautics Engineering. It offers students a comprehensive understanding of working principles of instruments. At the graduate level, I teach Optimization Techniques in Engineering, guiding students through nearly 50 optimization problems, model formulation, Python coding, and solution analysis. In 2023, I mentored my first Master's student on terminal airspace complexity using multi-criteria decision-making tools.";
            bioParagraphs[4].textContent = "From October 2025 to August 2026, I served as Vice Dean of the Faculty of Aeronautics and Astronautics. I serve on the University Education Commission and the Strategic Planning Commission, shaping educational strategies and long-term goals. I also mentor several student teams and frequently serve as a jury member in numerous M.Sc. and Ph.D. thesis defenses.";
            bioParagraphs[5].textContent = "Throughout my professional career, I have been actively involved in various research and development projects, including those funded by the EU, TUBITAK, and university programs, serving as a project coordinator, advisor, and expert. Additionally, I currently provide project-based consultancy services to a company in the defense industry.";
        }

        const bioMore = document.querySelector('#about .bio-more');
        const publicationParagraph = Array.from(document.querySelectorAll('#about .bio-more p')).find(p => p.textContent.includes('As of July 2026') || p.textContent.includes('My publication record features'));
        if (publicationParagraph) {
            publicationParagraph.textContent = "As of September 2026, my publication record features 44 works (30 journal papers, 13 conference proceedings, and 1 book chapter). Of these, 23 are Q1/Q2 indexed papers (11 in Q1, 12 in Q2).";
        } else if (bioMore) {
            const techParagraph = Array.from(bioMore.querySelectorAll('p')).find(p => p.textContent.includes('In my courses and research'));
            const newPublicationParagraph = document.createElement('p');
            newPublicationParagraph.textContent = "As of September 2026, my publication record features 44 works (30 journal papers, 13 conference proceedings, and 1 book chapter). Of these, 23 are Q1/Q2 indexed papers (11 in Q1, 12 in Q2).";
            if (techParagraph) {
                techParagraph.insertAdjacentElement('beforebegin', newPublicationParagraph);
            } else {
                bioMore.appendChild(newPublicationParagraph);
            }
        }

        const adminRolesCard = Array.from(document.querySelectorAll('#positions .bento-card')).find(card => card.querySelector('h3')?.textContent.includes('Service'));
        if (adminRolesCard) {
            const firstDate = adminRolesCard.querySelector('.position-list .position-entry .position-date');
            if (firstDate) {
                firstDate.textContent = 'Oct 2025 - Aug 2026';
            }

            if (!adminRolesCard.querySelector('.jury-service-block')) {
                const supervisedBlock = adminRolesCard.querySelectorAll('.divider-top')[0];
                if (supervisedBlock) {
                    const juryBlock = document.createElement('div');
                    juryBlock.className = 'divider-top jury-service-block';
                    juryBlock.innerHTML = `
                        <span class="label" style="margin-bottom: 1rem; display: block;">Jury Service</span>
                        <div class="position-entry">
                            <div class="position-date">Ongoing</div>
                            <div class="position-details">
                                <strong>Jury Member</strong>
                                <span class="institution-text">Serving in numerous M.Sc. and Ph.D. thesis defenses across related fields.</span>
                            </div>
                        </div>
                    `;
                    supervisedBlock.insertAdjacentElement('afterend', juryBlock);
                }
            }
        }

        const labsSection = document.getElementById('labs');
        if (labsSection) {
            const labsTitle = labsSection.querySelector('.section-title h2');
            const labsLabel = labsSection.querySelector('.section-title .label');
            if (labsTitle) labsTitle.textContent = 'Labs / Working Groups';
            if (labsLabel) labsLabel.textContent = 'Research Networks';

            const labsGrid = labsSection.querySelector('.grid-2');
            if (labsGrid && !labsGrid.querySelector('.mspace-card')) {
                const mspaceCard = document.createElement('div');
                mspaceCard.className = 'bento-card mspace-card';
                mspaceCard.innerHTML = `
                    <span class="label">CA24122 · Working Group</span>
                    <h3>mSPACE <i>Action</i></h3>
                    <p>Member of the "CA24122 - multiscale Stochastics, Patterns, and Analysis of Combinatorial Environments (mSPACE)" Action Working Group.</p>
                    <p style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-dim);">Since April 2026</p>
                `;
                labsGrid.appendChild(mspaceCard);
            }

            const mspaceLabel = labsGrid.querySelector('.mspace-card .label');
            if (mspaceLabel) {
                mspaceLabel.textContent = 'CA24122 - Working Group';
            }
        }

        const contactSection = document.getElementById('contact');
        if (contactSection && !document.getElementById('news')) {
            const newsItems = [
                {
                    source: 'Samsun University',
                    meta: 'International Recognition',
                    title: 'Accepted to the CA24122 mSPACE Action Working Group',
                    summary: 'I was accepted to the CA24122 mSPACE Action Working Group, marking a new step in my international academic collaboration activities.',
                    url: 'https://samsun.edu.tr/ogretim-uyemiz-dr-ogr-uyesi-doc-dr-kadir-donmezden-uluslararasi-calismalara-katki/',
                    image: 'photos/news-previews/samsun-mspace.png'
                },
                {
                    source: 'Samsun University',
                    meta: 'Project Award',
                    title: 'TUBITAK 1002 Project Awarded for UAV-Based Aircraft Damage Detection',
                    summary: 'My project was accepted under the TUBITAK 1002 program, supporting research on UAV-assisted deep learning for aircraft damage detection.',
                    url: 'https://samsun.edu.tr/doc-dr-kadir-donmezden-tubitak-proje-basarisi/',
                    image: 'photos/news-previews/samsun-tubitak.png'
                },
                {
                    source: 'LinkedIn',
                    meta: 'Teaching Mobility',
                    title: 'Erasmus+ Teaching Mobility Visit to UPC',
                    summary: 'I visited UPC as part of an Erasmus+ teaching mobility program and contributed to academic exchange in air traffic management education.',
                    url: 'https://www.linkedin.com/posts/kadir-d%C3%B6nmez-4b99b2174_erasmusplus-academiccollaboration-airtrafficmanagement-activity-7452704682860351488-QRZa?utm_source=share&utm_medium=member_desktop&rcm=ACoAAClwN00Bosdl-eYhYzagMpD7Pna8nQxQEsQ',
                    image: 'photos/news-previews/linkedin-erasmus.png'
                },
                {
                    source: 'LinkedIn',
                    meta: 'Invited Speaker',
                    title: 'Invited Speaker at TSI for International Civil Aviation Day',
                    summary: 'I took part as an invited speaker at TSI during the International Civil Aviation Day program, sharing perspectives on aviation and air traffic management.',
                    url: 'https://www.linkedin.com/posts/kadir-d%C3%B6nmez-4b99b2174_internationalcivilaviationday-aviation-atm-activity-7403830846853615616-7rLo?utm_source=share&utm_medium=member_desktop&rcm=ACoAAClwN00Bosdl-eYhYzagMpD7Pna8nQxQEsQ',
                    image: 'photos/news-previews/linkedin-civil-aviation.png'
                },
                {
                    source: 'LinkedIn',
                    meta: 'Professional Training',
                    title: 'UAV Training Delivered in Two Cities for the General Directorate of Forestry',
                    summary: 'Within the IHA-1 Commercial UAV Pilot Course scope, I delivered training programs for the General Directorate of Forestry in two different cities.',
                    url: 'https://www.linkedin.com/posts/kadir-d%C3%B6nmez-4b99b2174_i%CC%87ha-1-ticari-i%CC%87nsans%C4%B1z-hava-arac%C4%B1-pilotu-kurs-activity-7294688054672318464-cv3I?utm_source=share&utm_medium=member_desktop&rcm=ACoAAClwN00Bosdl-eYhYzagMpD7Pna8nQxQEsQ',
                    image: 'photos/news-previews/linkedin-pilot-course.png'
                },
                {
                    source: 'LinkedIn',
                    meta: 'Conference Presentation',
                    title: 'Presented a Poster at SESAR Innovation Days',
                    summary: 'I participated in SESAR Innovation Days with a poster presentation focused on air traffic management research and innovation.',
                    url: 'https://www.linkedin.com/posts/kadir-d%C3%B6nmez-4b99b2174_sesarinnovationdays-airtrafficmanagement-activity-7262490023206256641-lHVQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAClwN00Bosdl-eYhYzagMpD7Pna8nQxQEsQ',
                    image: 'photos/news-previews/linkedin-sesar.png'
                },
                {
                    source: 'LinkedIn',
                    meta: 'Media Appearance',
                    title: 'Joined TRT Trabzon Radio to Introduce Our Department',
                    summary: 'I took part in a TRT Trabzon Radio program to share information about our department, its academic structure, and its educational focus.',
                    url: 'https://www.linkedin.com/posts/kadir-d%C3%B6nmez-4b99b2174_uaexakbakaftmveonaraftm-aircraftmaintenance-activity-7198251772535046144-C38e?utm_source=share&utm_medium=member_desktop&rcm=ACoAAClwN00Bosdl-eYhYzagMpD7Pna8nQxQEsQ',
                    image: 'photos/news-previews/linkedin-maintenance.png'
                }
            ];

            const escapeHtml = (value) => String(value)
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;')
                .replaceAll('"', '&quot;')
                .replaceAll("'", '&#39;');

            const renderNewsCard = (item) => `
                <article class="bento-card news-compact-card">
                    <div class="news-preview-shell">
                        <img
                            class="news-preview-image"
                            src="${escapeHtml(item.image)}"
                            alt="${escapeHtml(item.title)} preview"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >
                    </div>
                    <div class="news-card-top">
                        <span class="news-source-pill">${escapeHtml(item.source)}</span>
                        <span class="news-card-meta">${escapeHtml(item.meta)}</span>
                    </div>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p class="news-card-summary">${escapeHtml(item.summary)}</p>
                    <a class="news-read-more" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">Read more</a>
                </article>
            `;

            const newsSection = document.createElement('section');
            newsSection.id = 'news';
            newsSection.innerHTML = `
                <div class="container">
                    <div class="section-title">
                        <h2>News From Me</h2>
                        <div class="label">Recent Updates</div>
                    </div>
                    <div class="news-carousel-shell">
                        <div class="news-carousel-hint">Scroll for more</div>
                        <div class="news-carousel-track">
                            <button class="news-carousel-arrow news-carousel-arrow-prev" type="button" aria-label="Scroll news left">&#8249;</button>
                            <div class="news-embed-grid">
                            ${newsItems.map(renderNewsCard).join('')}
                            </div>
                            <button class="news-carousel-arrow news-carousel-arrow-next" type="button" aria-label="Scroll news right">&#8250;</button>
                        </div>
                    </div>
                </div>
            `;
            contactSection.parentNode.insertBefore(newsSection, contactSection);

            const newsGrid = newsSection.querySelector('.news-embed-grid');
            const prevArrow = newsSection.querySelector('.news-carousel-arrow-prev');
            const nextArrow = newsSection.querySelector('.news-carousel-arrow-next');

            if (newsGrid && prevArrow && nextArrow) {
                const getScrollStep = () => {
                    const firstCard = newsGrid.querySelector('.news-compact-card');
                    const gridStyles = window.getComputedStyle(newsGrid);
                    const gap = parseFloat(gridStyles.columnGap || gridStyles.gap || '0');
                    return firstCard
                        ? firstCard.getBoundingClientRect().width + gap
                        : Math.max(newsGrid.clientWidth * 0.85, 280);
                };

                const updateNewsArrows = () => {
                    const maxScrollLeft = Math.max(newsGrid.scrollWidth - newsGrid.clientWidth, 0);
                    const hasOverflow = maxScrollLeft > 12;
                    prevArrow.hidden = !hasOverflow;
                    nextArrow.hidden = !hasOverflow;
                    prevArrow.disabled = newsGrid.scrollLeft <= 12;
                    nextArrow.disabled = newsGrid.scrollLeft >= maxScrollLeft - 12;
                };

                prevArrow.addEventListener('click', () => {
                    newsGrid.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
                });

                nextArrow.addEventListener('click', () => {
                    newsGrid.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
                });

                newsGrid.addEventListener('scroll', updateNewsArrows, { passive: true });
                window.addEventListener('resize', updateNewsArrows);
                requestAnimationFrame(updateNewsArrows);
            }
        }
    }
    syncAcademicProfileContent();

    // Project Funding Filters
    function initProjectFilters() {
        const projectSection = document.getElementById('projects');
        const projectGrid = projectSection?.querySelector('.bento-grid');
        const sectionTitle = projectSection?.querySelector('.section-title');
        const cards = Array.from(projectGrid?.querySelectorAll('.bento-card') ?? []);

        if (!projectSection || !projectGrid || !sectionTitle || cards.length === 0) {
            return;
        }

        const inferGroup = (text) => {
            const label = (text || '').toLowerCase();
            if (label.includes('eu funded') || label.includes('atcosima')) return 'eu';
            if (label.includes('university funded')) return 'university';
            return 'tubitak';
        };

        const filterOptions = [
            { key: 'tubitak', label: 'TUBITAK FUNDED' },
            { key: 'eu', label: 'EU FUNDED' },
            { key: 'university', label: 'UNIVERSITY FUNDED' }
        ];

        cards.forEach(card => {
            const label = card.querySelector('.label')?.textContent || '';
            card.classList.add('project-card');
            card.dataset.projectGroup = inferGroup(label);
        });

        const filters = document.createElement('div');
        filters.className = 'project-filters';
        filters.setAttribute('role', 'tablist');
        filters.setAttribute('aria-label', 'Project funding categories');

        const buttons = filterOptions.map(option => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'project-filter';
            button.dataset.projectFilter = option.key;
            button.textContent = option.label;
            button.setAttribute('aria-pressed', 'false');
            filters.appendChild(button);
            return button;
        });

        sectionTitle.insertAdjacentElement('afterend', filters);

        const setFilter = (group) => {
            buttons.forEach(button => {
                const isActive = button.dataset.projectFilter === group;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-pressed', String(isActive));
            });

            cards.forEach(card => {
                const matches = card.dataset.projectGroup === group;
                card.classList.toggle('project-card-hidden', !matches);
                card.setAttribute('aria-hidden', String(!matches));
            });

            projectGrid.dataset.activeProjectGroup = group;
        };

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                setFilter(button.dataset.projectFilter);
            });
        });

        setFilter('tubitak');
    }
    initProjectFilters();

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

    document.querySelectorAll('section, .bento-card, .timeline-item, .pub-item, .chart-card, .metric-card').forEach(el => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // ---- Counter Animation (Citation Metrics) ----
    function animateCounter(el, target, duration = 1500) {
        const startTime = performance.now();
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetVal = parseInt(el.textContent);
                if (!isNaN(targetVal) && !el.dataset.animated) {
                    el.dataset.animated = 'true';
                    animateCounter(el, targetVal);
                }
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-number, .footer-stat-number').forEach(el => {
        counterObserver.observe(el);
    });

    // ---- Card Tilt / Shine Effect ----
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
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

    // ---- Biography Read More Toggle ----
    window.toggleBio = function(btn) {
        const moreContent = btn.previousElementSibling;
        if (moreContent.style.display === 'none') {
            moreContent.style.display = 'block';
            btn.textContent = 'Read Less ▲';
        } else {
            moreContent.style.display = 'none';
            btn.textContent = 'Read More ▼';
            const card = btn.closest('.bento-card');
            if (card) {
                const rect = card.getBoundingClientRect();
                if (rect.top < 0) {
                    window.scrollBy({ top: rect.top - 100, behavior: 'smooth' });
                }
            }
        }
    };

    // ---- Publications Discover More Toggle ----
    function initPublicationsToggle() {
        const panels = ['journals', 'proceedings'];

        const proceedingsPanel = document.getElementById('proceedings');
        if (proceedingsPanel) {
            proceedingsPanel.querySelectorAll('.pub-item').forEach(item => {
                const text = item.querySelector('.pub-content p')?.textContent || '';
                if (text.includes('Validating and modeling of metrics of micro turbojet engine by experimental and ML methods')) {
                    item.querySelector('.selected-badge')?.remove();
                }
            });
        }

        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (!panel) return;
            const items = panel.querySelectorAll('.pub-item');
            let hasHidden = false;
            
            items.forEach(item => {
                if (!item.querySelector('.selected-badge')) {
                    item.classList.add('hidden-pub');
                    hasHidden = true;
                }
            });

            if (hasHidden) {
                const btnContainer = document.createElement('div');
                btnContainer.style.textAlign = 'center';
                btnContainer.style.marginTop = '1.5rem';
                
                const btn = document.createElement('button');
                btn.className = 'read-more-btn';
                btn.textContent = 'Discover More ▼';
                
                btn.onclick = function() {
                    const hiddenItems = panel.querySelectorAll('.hidden-pub, .revealed-pub');
                    const isExpanding = btn.textContent.includes('Discover');
                    
                    hiddenItems.forEach(item => {
                        if (isExpanding) {
                            item.classList.remove('hidden-pub');
                            item.classList.add('revealed-pub');
                        } else {
                            item.classList.add('hidden-pub');
                            item.classList.remove('revealed-pub');
                        }
                    });
                    
                    btn.textContent = isExpanding ? 'Show Less ▲' : 'Discover More ▼';
                };
                
                btnContainer.appendChild(btn);
                panel.appendChild(btnContainer);
            }
        });
    }
    initPublicationsToggle();

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
        const journalsByYear = [2, 1, 2, 0, 2, 0, 4, 6, 3, 4, 6];
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
                        data: [11, 12, 7],
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
                        'Transportation Research Part E',
                        'J. Thermal Anal. Calorim.',
                        'Transportation Research Interdisciplinary Perspectives'
                    ],
                    datasets: [{
                        label: 'Papers',
                        data: [4, 4, 3, 2, 1, 1, 1, 1, 1],
                        backgroundColor: palette.slice(0, 9),
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
                        data: [6, 6, 12, 22, 38, 51, 63, 103, 91],
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
                        data: [30, 13, 1],
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
                        data: [5, 1, 4],
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
                    labels: ['PI', 'Researcher', 'Scholar', 'Expert'],
                    datasets: [{
                        data: [1, 7, 1, 1],
                        backgroundColor: [
                            'rgba(139,92,246,0.85)',    // Violet — PI
                            `rgba(${accentRGB}, 0.85)`, // Blue — Researcher
                            'rgba(251,191,36,0.85)',    // Amber — Scholar
                            'rgba(16,185,129,0.85)',    // Emerald — Expert
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
                        data: [28, 15],
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

    if (document.getElementById('analysis')?.classList.contains('active') && !chartsInitialized) {
        setTimeout(renderAnalysisCharts, 120);
    }

    // Re-render charts when theme changes
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (chartsInitialized) {
                setTimeout(renderAnalysisCharts, 100);
            }
        });
    }
});
