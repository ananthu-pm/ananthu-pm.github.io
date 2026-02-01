// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Navbar background change on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form submission with AJAX and Confirmation
const contactForm = document.querySelector('.contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const warningMsg = document.getElementById('form-warning');
const errorMsg = document.getElementById('form-error');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Manual validation check
        if (!contactForm.checkValidity()) {
            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');
            warningMsg.classList.remove('hidden');

            // Shake effect for feedback
            submitBtn.classList.add('shake');
            setTimeout(() => submitBtn.classList.remove('shake'), 500);
            return;
        }

        // Hide warning if valid
        warningMsg.classList.add('hidden');

        // Loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
            .then(() => {
                // Success
                contactForm.reset();
                successMsg.classList.remove('hidden');
                errorMsg.classList.add('hidden');
                warningMsg.classList.add('hidden');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';

                setTimeout(() => {
                    successMsg.classList.add('hidden');
                }, 5000);
            })
            .catch((error) => {
                // Error
                console.error('Submission error:', error);
                errorMsg.classList.remove('hidden');
                successMsg.classList.add('hidden');
                warningMsg.classList.add('hidden');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            });
    });

    // Hide status messages when user starts typing again
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            warningMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');
        });
    });
}

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Direct movement for the dot
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Animated movement for the outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });

    // Background Glow Tracking - Improved
    const shape = document.querySelector('.background-shape');
    if (shape) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        shape.style.transform = `translate(${x * 80}px, ${y * 80}px)`;
    }
});

// Cursor active states
const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card, .contact-form input, .contact-form textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
    });
});
