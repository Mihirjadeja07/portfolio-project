document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 20 }, 
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Contact Form Submission
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        formStatus.textContent = 'Sending...';
        formStatus.className = 'text-center mt-6 text-blue-400';

        try {
            // ===================================================================
            // This now points to your live backend server on Render.
            // ===================================================================
            const response = await fetch('https://mihirsinh.onrender.com/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.className = 'text-center mt-6 text-green-400';
                form.reset();
            } else {
                throw new Error('Failed to send message.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.textContent = 'An error occurred. Please try again later.';
            formStatus.className = 'text-center mt-6 text-red-400';
        }
    });
});
