// Inspire Travels Website JavaScript - Modular Architecture
// Author: Zig Zag AI
// Description: Core initialization that orchestrates all modules

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all modules
    window.PreloaderModule.init();
    window.AOSModule.init();        // Initialize AOS animations first
    window.HeroModule.init();
    window.NavigationModule.init();
    window.MobileMenuModule.init();
    window.ToursModule.init();
    window.AboutModule.init();
    window.GalleryModule.init();
    window.ReviewsModule.init();
    window.ModalModule.initTooltips();
    window.ModalModule.initGlobalModalBehavior();

    // Console log for debugging
    console.log('Inspire Travels website loaded successfully!');
    console.log('All modules initialized: Preloader, AOS, Hero, Navigation, MobileMenu, Tours, About, Gallery, Reviews, Modal');
});
