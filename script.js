document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    document.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorRing.style.left = `${e.clientX}px`;
            cursorRing.style.top = `${e.clientY}px`;
        });
    });

    // Add hover state for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .product-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add specific logic for process line animation if needed
                if (entry.target.classList.contains('process-step')) {
                    // Logic to animate line could go here, for now rely on basic fade
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in');
    animatedElements.forEach(el => observer.observe(el));

    // Dynamic Lighting & Solar Path Engine
    const root = document.documentElement;
    const heroSection = document.getElementById('hero');
    const processSection = document.getElementById('process');

    // Solar State
    let scrollProgress = 0;

    window.addEventListener('scroll', () => {
        // Calculate scroll progress (0 to 1)
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        scrollProgress = window.scrollY / totalHeight;

        // 1. Sun Position Strategy:
        // Starts at top-right (Dawn) -> Moves to top-center/overhead (Noon/Clarity) -> Moves towards bottom (Sunset/Legacy)
        // We render this via CSS variables that control gradients and shadows.

        // Light X position: Moves from 80% (right) to 20% (left) as you scroll down
        const lightX = 80 - (scrollProgress * 60);
        // Light Y position: Follows the scroll but 'rises' relatively
        const lightY = Math.max(0, 30 - (scrollProgress * 20));

        root.style.setProperty('--light-x', `${lightX}%`);
        root.style.setProperty('--light-y', `${lightY}%`);

        // 2. Dynamic Shadow Cast
        // As light moves left, shadows move right.
        const shadowX = (scrollProgress - 0.5) * 20; // -10px to 10px
        const shadowY = 10 + (scrollProgress * 10);  // 10px to 20px
        root.style.setProperty('--shadow-x', `${shadowX}px`);
        root.style.setProperty('--shadow-y', `${shadowY}px`);

        // 3. Atmosphere Shift (Background Gradient)
        // Shift gradient stops to simulate sun rising/moving
        const gradientMove = 30 + (scrollProgress * 40); // 30% to 70%
        root.style.setProperty('--bg-gradient-pos', `${gradientMove}%`);

        // 4. Header Change
        const header = document.querySelector('.glass-header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.7)';
            header.style.boxShadow = 'none';
        }

        // 5. 'Illuminated Path' Logic for Process Section
        if (processSection) {
            const rect = processSection.getBoundingClientRect();
            // Start lighting up the path when section enters view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate how far through the section we are
                const sectionProgress = Math.min(Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)), 1);

                // Update the line fill width based on scroll through the section
                const lineFill = processSection.querySelector('.line-fill');
                if (lineFill) {
                    lineFill.style.width = `${sectionProgress * 100}%`;
                }

                // Sequentially light up steps
                const steps = processSection.querySelectorAll('.process-step');
                steps.forEach((step, index) => {
                    // Light up step if the line has reached it (approx based on index)
                    const triggerPoint = (index + 0.5) / steps.length;
                    if (sectionProgress > triggerPoint) {
                        step.classList.add('lit');
                    } else {
                        step.classList.remove('lit');
                    }
                });
            }
        }
    });

    // Initial trigger
    window.dispatchEvent(new Event('scroll'));
});
