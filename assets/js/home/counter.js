// Counter Module - Animates stat number increments on scroll
// Author: Zig Zag AI
// Description: Uses IntersectionObserver and requestAnimationFrame with easeOutQuad easing.

(function() {
    'use strict';

    window.CounterModule = {
        init: function() {
            const counters = document.querySelectorAll('.counter');
            if (counters.length === 0) return;

            const animateCounter = (counter) => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const decimals = parseInt(counter.getAttribute('data-decimals') || '0');
                const useThousands = counter.getAttribute('data-thousands') === 'true';
                const duration = 2000; // 2 seconds animation duration
                const start = 0;
                let startTime = null;

                const step = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    
                    // Quadratic ease-out easing formula
                    const easeProgress = progress * (2 - progress);
                    const currentValue = start + easeProgress * (target - start);
                    
                    let formattedValue = currentValue.toFixed(decimals);
                    
                    if (useThousands) {
                        const parts = formattedValue.split('.');
                        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        formattedValue = parts.join('.');
                    }

                    counter.textContent = formattedValue;

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        // Ensure final target value is set exactly at the end
                        let finalValue = target.toFixed(decimals);
                        if (useThousands) {
                            const parts = finalValue.split('.');
                            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            finalValue = parts.join('.');
                        }
                        counter.textContent = finalValue;
                    }
                };

                requestAnimationFrame(step);
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        animateCounter(counter);
                        observer.unobserve(counter); // Run animation once
                    }
                });
            }, {
                threshold: 0.1
            });

            counters.forEach(counter => {
                observer.observe(counter);
            });
        }
    };
})();
