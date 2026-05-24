/* ============================================================
   ANANTHU PM — INDUSTRY 4.0 PORTFOLIO v2.0
   JavaScript — All Interactions & Advanced Animations
   ============================================================ */

(function () {
    'use strict';

    /* ============================================================
       1. LOADING SCREEN
       ============================================================ */
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingText = document.getElementById('loading-text');

    const loadingMessages = [
        'INITIALIZING SYSTEM',
        'LOADING MODULES',
        'CONNECTING NODES',
        'CALIBRATING AI CORE',
        'RENDERING INTERFACE',
        'SYSTEM READY'
    ];

    let loadProgress = 0;
    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15 + 10;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            setTimeout(dismissLoading, 400);
        }
        if (loadingBar) loadingBar.style.width = loadProgress + '%';
        const idx = Math.min(Math.floor((loadProgress / 100) * loadingMessages.length), loadingMessages.length - 1);
        if (loadingText) loadingText.textContent = loadingMessages[idx];
    }, 180);

    function dismissLoading() {
        if (loadingScreen) {
            loadingScreen.classList.add('dismissed');
            document.body.classList.remove('loading');
            setTimeout(() => { loadingScreen.style.display = 'none'; }, 800);
        }
    }

    setTimeout(dismissLoading, 3200);

    /* ============================================================
       2. PARTICLE NETWORK CANVAS
       ============================================================ */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                initParticles();
            }, 300);
        });

        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        const particleColors = [
            '0, 212, 255',
            '0, 128, 255',
            '123, 92, 255',
            '0, 255, 136'
        ];

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.6;
                this.baseAlpha = Math.random() * 0.5 + 0.15;
                this.alpha = this.baseAlpha;
                this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 250) {
                    // Glow much brighter near cursor
                    this.alpha = this.baseAlpha + (1 - dist / 250) * 0.6;
                    // Strong push away from mouse
                    const force = (250 - dist) / 250 * 0.8;
                    this.x -= (dx / dist) * force;
                    this.y -= (dy / dist) * force;
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            const area = canvas.width * canvas.height;
            const count = Math.min(Math.floor(area / 7500), 200);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 180) {
                        const alpha = (1 - dist / 180) * 0.22;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // Mouse connections — bright green web
            for (let i = 0; i < particles.length; i++) {
                const dx = mouse.x - particles[i].x;
                const dy = mouse.y - particles[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 220) {
                    const alpha = (1 - dist / 220) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    /* ============================================================
       3. AOS INIT
       ============================================================ */
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 60
    });

    /* ============================================================
       4. TYPING EFFECT
       ============================================================ */
    const typingTarget = document.getElementById('typing-target');
    if (typingTarget) {
        const titles = [
            'Industry 4.0 Specialist',
            'MES Specialist',
            'AI & Smart Manufacturing Enthusiast',
            'Digital Transformation Architect',
            'Intelligent Production Specialist'
        ];

        let titleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let speed = 80;

        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        typingTarget.parentNode.insertBefore(cursorSpan, typingTarget.nextSibling);

        function typeEffect() {
            const current = titles[titleIndex];

            if (isDeleting) {
                typingTarget.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                speed = 35;
            } else {
                typingTarget.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                speed = 75;
            }

            if (!isDeleting && charIndex === current.length) {
                speed = 2800;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                speed = 500;
            }

            setTimeout(typeEffect, speed);
        }

        setTimeout(typeEffect, 2200);
    }

    /* ============================================================
       5. NAVBAR — SCROLL + SCROLL SPY
       ============================================================ */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    let lastScrollY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 30);
        }

        // Scroll spy
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navLinksEl = document.getElementById('nav-links');
                const hamburger = document.getElementById('hamburger');
                if (navLinksEl) navLinksEl.classList.remove('open');
                if (hamburger) {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }

                window.scrollTo({
                    top: target.offsetTop - 64,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================================================
       6. MOBILE HAMBURGER
       ============================================================ */
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('nav-links');

    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinksEl.classList.toggle('open');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }

    /* ============================================================
       7. COUNTER ANIMATION
       ============================================================ */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2200;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.floor(eased * target) + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + '+';
            }
        }

        requestAnimationFrame(update);
    }

    if (statNumbers.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    /* ============================================================
       8. PROJECT FILTERING
       ============================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const shouldShow = filter === 'all' || categories.includes(filter);

                if (shouldShow) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.98)';

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        });
                    });
                } else {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.98)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });

    /* ============================================================
       9. CUSTOM CURSOR + TRAIL
       ============================================================ */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;

    if (cursorDot && cursorOutline && !isTouchDevice) {
        // Trail dots
        const trailCount = 8;
        const trailDots = [];

        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.opacity = '0';
            document.body.appendChild(dot);
            trailDots.push({ el: dot, x: 0, y: 0 });
        }

        let mouseX = 0, mouseY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            cursorOutline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 350, fill: 'forwards' });
        });

        // Animate trail
        function updateTrail() {
            let prevX = mouseX;
            let prevY = mouseY;

            trailDots.forEach((dot, i) => {
                const speed = 0.25 - (i * 0.02);
                dot.x += (prevX - dot.x) * speed;
                dot.y += (prevY - dot.y) * speed;

                dot.el.style.left = `${dot.x}px`;
                dot.el.style.top = `${dot.y}px`;
                dot.el.style.transform = `translate(-50%, -50%) scale(${1 - (i * 0.1)})`;
                dot.el.style.opacity = `${0.35 - (i * 0.04)}`;

                prevX = dot.x;
                prevY = dot.y;
            });

            requestAnimationFrame(updateTrail);
        }

        updateTrail();

        // Interactive hover
        const interactiveEls = document.querySelectorAll(
            'a, button, .btn, .project-card, .service-card, .dash-card, ' +
            '.info-card, .vision-pillar, .hex-item, .tech-tag, .filter-btn, ' +
            '.contact-form input, .contact-form textarea'
        );

        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
        });
    }

    /* ============================================================
       10. PARALLAX ELEMENTS
       ============================================================ */
    const parallaxElements = document.querySelectorAll('.ai-pulse-ring, .ambient-orb');

    if (parallaxElements.length > 0 && !isTouchDevice) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach((el, i) => {
                const rate = 0.03 + (i * 0.01);
                el.style.transform = `translateY(${scrollY * rate}px)`;
            });
        }, { passive: true });
    }

    /* ============================================================
       11. SECTION REVEAL ENHANCEMENT
       ============================================================ */
    const revealSections = document.querySelectorAll('section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    revealSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        revealObserver.observe(section);
    });

    /* ============================================================
       12. CONTACT FORM
       ============================================================ */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const warningMsg = document.getElementById('form-warning');
    const errorMsg = document.getElementById('form-error');
    const funnyOverlay = document.getElementById('funny-overlay');
    let errorCount = 0;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                let message = 'Please fill in all required fields.';

                const nameInput = contactForm.querySelector('input[name="entry.1969004993"]');
                const emailInput = contactForm.querySelector('input[name="entry.230809009"]');
                const messageInput = contactForm.querySelector('textarea[name="entry.977138015"]');
                const nameRegex = /^[a-zA-Z\s]+$/;

                if (nameInput && nameInput.value.trim() === '') {
                    message = 'Please enter your name.';
                } else if (nameInput && !nameRegex.test(nameInput.value.trim())) {
                    message = 'Invalid name. (Use only letters and spaces)';
                } else if (emailInput && emailInput.value.trim() === '') {
                    message = 'Please enter your email.';
                } else if (emailInput && !emailInput.checkValidity()) {
                    message = 'Please enter a valid email address.';
                } else if (messageInput && messageInput.value.trim() === '') {
                    message = 'Please enter your message.';
                }

                warningMsg.querySelector('span').textContent = message;
                successMsg.classList.add('hidden');
                errorMsg.classList.add('hidden');
                warningMsg.classList.remove('hidden');

                errorCount++;
                if (errorCount > 3 && funnyOverlay) {
                    funnyOverlay.classList.remove('hidden');
                }

                submitBtn.classList.add('shake');
                setTimeout(() => submitBtn.classList.remove('shake'), 500);
                return;
            }

            warningMsg.classList.add('hidden');

            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>TRANSMITTING...</span>';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';

            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            })
                .then(() => {
                    contactForm.reset();
                    successMsg.classList.remove('hidden');
                    errorMsg.classList.add('hidden');
                    warningMsg.classList.add('hidden');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';
                    errorCount = 0;

                    setTimeout(() => successMsg.classList.add('hidden'), 5000);
                })
                .catch((error) => {
                    console.error('Submission error:', error);
                    errorMsg.classList.remove('hidden');
                    successMsg.classList.add('hidden');
                    warningMsg.classList.add('hidden');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.pointerEvents = 'auto';
                });
        });

        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                warningMsg.classList.add('hidden');
                errorMsg.classList.add('hidden');
            });
        });
    }

    // Dismiss funny overlay
    if (funnyOverlay) {
        const dismissOverlay = () => {
            if (!funnyOverlay.classList.contains('hidden')) {
                funnyOverlay.classList.add('hidden');
                errorCount = 0;
            }
        };
        window.addEventListener('click', dismissOverlay);
        window.addEventListener('keydown', dismissOverlay);
    }

})();
