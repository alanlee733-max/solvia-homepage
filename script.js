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

    // Scroll Effects
    const processSection = document.getElementById('process');

    window.addEventListener('scroll', () => {
        // Header styling now controlled by CSS
        // const header = document.querySelector('.glass-header');
        // if (window.scrollY > 50) {
        //     header.style.background = 'rgba(255, 255, 255, 0.95)';
        //     header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
        // } else {
        //     header.style.background = 'rgba(255, 255, 255, 0.7)';
        //     header.style.boxShadow = 'none';
        // }

        // 2. Process Section Line Animation
        if (processSection) {
            const rect = processSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const sectionProgress = Math.min(Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)), 1);

                const lineFill = processSection.querySelector('.line-fill');
                if (lineFill) {
                    lineFill.style.width = `${sectionProgress * 100}%`;
                }

                const steps = processSection.querySelectorAll('.process-step');
                steps.forEach((step, index) => {
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

    // ==================== Contact Modal ====================
    const contactModal = document.getElementById('contactModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const contactButtons = document.querySelectorAll('a[href="#contact"]');
    const contactForm = document.getElementById('contactForm');

    // Open modal
    function openModal() {
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close modal
    function closeModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Event listeners
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // Show success message (temporary visual feedback)
        alert('Thank you for your inquiry! We will get in touch with you soon.');

        // Reset form and close modal
        contactForm.reset();
        closeModal();

        // TODO: Add actual form submission logic here (e.g., send to backend API)
    });

    // ==================== Product Catalog Modal ====================
    const productModal = document.getElementById('productModal');
    const productModalOverlay = productModal.querySelector('.modal-overlay');
    const productModalClose = productModal.querySelector('.modal-close');
    const productCards = document.querySelectorAll('.product-card');
    const modalCategoryTitle = document.getElementById('modalCategoryTitle');
    const modalCategoryDesc = document.getElementById('modalCategoryDesc');
    const productListGrid = document.getElementById('productListGrid');

    // Sample product data
    const productData = {
        'medical-devices': {
            title: 'Medical Devices',
            description: 'FDA/CE certified equipment for professional aesthetic treatments',
            products: [
                { name: 'Theraon PDO Threads', desc: 'Premium quality absorbable PDO threads for facial rejuvenation' },
                { name: 'Dermal Fillers HA', desc: 'Hyaluronic acid based fillers for volume restoration' },
                { name: 'Botulinum Toxin Type A', desc: 'Purified neurotoxin for wrinkle reduction' },
                { name: 'Laser Equipment', desc: 'Advanced laser systems for skin treatments' },
                { name: 'RF Microneedling', desc: 'Radiofrequency microneedling devices' },
                { name: 'Fat Dissolving Injection', desc: 'Non-surgical body contouring solutions' }
            ]
        },
        'cosmeceuticals': {
            title: 'Cosmeceuticals',
            description: 'Clinical-grade skincare with proven efficacy and safety',
            products: [
                { name: 'Vitamin C Serum', desc: 'High-potency antioxidant serum for brightening' },
                { name: 'Retinol Complex', desc: 'Professional-grade retinol for anti-aging' },
                { name: 'Hyaluronic Acid Booster', desc: 'Deep hydration and plumping serum' },
                { name: 'Peptide Repair Cream', desc: 'Advanced peptide formula for skin renewal' },
                { name: 'Chemical Peel Solution', desc: 'Professional exfoliation treatments' },
                { name: 'Sunscreen SPF 50+', desc: 'Medical-grade UV protection' }
            ]
        },
        'professional-equipment': {
            title: 'Professional Equipment',
            description: 'Advanced tools for medical practitioners and clinics',
            products: [
                { name: 'LED Light Therapy', desc: 'Multi-wavelength LED treatment systems' },
                { name: 'Cryotherapy Device', desc: 'Cold therapy for skin rejuvenation' },
                { name: 'Ultrasound Skin Tightening', desc: 'Non-invasive lifting technology' },
                { name: 'Oxygen Infusion', desc: 'Oxygen therapy for skin vitality' },
                { name: 'IPL Hair Removal', desc: 'Intense pulsed light hair reduction' },
                { name: 'Dermabrasion System', desc: 'Professional skin resurfacing equipment' }
            ]
        }
    };

    // Open product modal
    function openProductModal(category) {
        const data = productData[category];
        if (!data) return;

        // Update modal title and description
        modalCategoryTitle.textContent = data.title;
        modalCategoryDesc.textContent = data.description;

        // Render products
        productListGrid.innerHTML = '';
        data.products.forEach(product => {
            const productHTML = `
                <div class="product-item">
                    <div class="product-item-image">
                        <div class="product-placeholder-icon">📦</div>
                    </div>
                    <div class="product-item-info">
                        <h4>${product.name}</h4>
                        <p>${product.desc}</p>
                        <a href="#" class="product-item-link">Learn More →</a>
                    </div>
                </div>
            `;
            productListGrid.innerHTML += productHTML;
        });

        // Show modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close product modal
    function closeProductModal() {
        productModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for product cards
    productCards.forEach(card => {
        const viewBtn = card.querySelector('.product-view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const category = card.getAttribute('data-category');
                openProductModal(category);
            });
        }
    });

    // Close product modal
    productModalClose.addEventListener('click', closeProductModal);
    productModalOverlay.addEventListener('click', closeProductModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeProductModal();
        }
    });

    // ==================== Dropdown Navigation Items ====================
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = item.getAttribute('data-category');
            if (category) {
                openProductModal(category);
            }
        });
    });
});

// ==================== Scroll to Top Button ====================
const scrollToTopBtn = document.getElementById('scrollToTop');

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
