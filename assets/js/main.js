// Inspire Travels Website JavaScript - Modular Architecture
// Author: Zig Zag AI
// Description: Core initialization that orchestrates all modules

function initInspireTravels() {
    // Some pages load this file after the DOM is already ready. The guard
    // keeps initialization reliable without binding modules twice.
    if (document.documentElement.dataset.siteInitialized === 'true') return;
    document.documentElement.dataset.siteInitialized = 'true';

    // Initialize all modules safely
    if (window.AOSModule) window.AOSModule.init();
    if (window.HeroModule) window.HeroModule.init();
    if (window.PreloaderModule) window.PreloaderModule.init();
    if (window.NavigationModule) window.NavigationModule.init();
    if (window.MobileMenuModule) window.MobileMenuModule.init();
    if (window.ToursModule) window.ToursModule.init();
    if (window.FavoritesModule) window.FavoritesModule.init();
    if (window.AboutModule) window.AboutModule.init();
    if (window.ReviewsModule) window.ReviewsModule.init();
    if (window.GalleryModule) window.GalleryModule.init();
    if (window.PromoModule) window.PromoModule.init();
    if (window.CounterModule) window.CounterModule.init();
    if (window.WhatsAppModule) window.WhatsAppModule.init();
    // Console log for debugging
    console.log('Inspire Travels website loaded successfully!');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInspireTravels, { once: true });
} else {
    initInspireTravels();
}
