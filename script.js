document.addEventListener("DOMContentLoaded", function() {

    // --- On-Load Typography Animations (Apple Style Cascade) ---
    const heroH1 = document.querySelector('.animate-text-cascade');
    if (heroH1) {
        // Split the text into separate span words to cascade them
        const originalText = heroH1.innerHTML;
        const words = originalText.split('<br>');
        
        let newContent = '';
        words.forEach((line, index) => {
            newContent += `<span class="cascade-line">${line}</span>`;
            if (index < words.length - 1) newContent += '<br>';
        });
        
        heroH1.innerHTML = newContent;
        
        // After setup, add the 'revealed' class with a slight delay
        setTimeout(() => {
            const cascadeLines = heroH1.querySelectorAll('.cascade-line');
            cascadeLines.forEach((span, i) => {
                setTimeout(() => {
                    span.style.opacity = 1;
                    span.style.transform = "translateY(0)";
                }, i * 200); // 200ms delay between words for cascade effect
            });
        }, 100);
    }

    // Trigger other simple animate-text elements
    const fadeTexts = document.querySelectorAll('.animate-text');
    fadeTexts.forEach((text, i) => {
        setTimeout(() => {
            text.classList.add('revealed');
        }, 300 + (i * 150)); // Cascade them in gently
    });


    // --- Intersection Observer for Scroll Animations ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const appearOptions = {
        threshold: 0.1, // Trigger early to make it feel responsive
        rootMargin: "0px 0px -100px 0px" // Only trigger when near the visual area
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, appearOptions);

    revealElements.forEach(fader => {
        appearOnScroll.observe(fader);
    });


    // --- Smooth Scrolling with URL Update ---
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Ensure smoothness, even on non-supporting browsers
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Keep the URL tidy
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
});
