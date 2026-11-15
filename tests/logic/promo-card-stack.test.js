const { afterEach, test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const promoModulePath = path.resolve(__dirname, '../../assets/js/home/promo.js');

function createClassList(initialClasses = []) {
    const classes = new Set(initialClasses);

    return {
        add: (...names) => names.forEach(name => classes.add(name)),
        remove: (...names) => names.forEach(name => classes.delete(name)),
        contains: name => classes.has(name)
    };
}

function loadPromoModule(open = true) {
    const keydownListeners = [];
    const stack = {
        innerHTML: '',
        querySelectorAll: () => [],
        addEventListener: () => {}
    };
    const dots = {
        innerHTML: '',
        addEventListener: () => {}
    };
    const whatsappLink = { href: '' };
    const closeButton = { addEventListener: () => {} };
    const container = { classList: createClassList(['scale-95', 'translate-y-8', 'opacity-0']) };
    const modal = {
        classList: createClassList(['invisible', 'opacity-0']),
        addEventListener: () => {},
        querySelector: selector => selector === '.promo-modal-container' ? container : null
    };

    class FakeSwiper {
        static instances = [];

        constructor(element, options) {
            this.element = element;
            this.options = options;
            this.realIndex = 0;
            this.nextCalls = 0;
            this.previousCalls = 0;
            this.slideToCalls = [];
            FakeSwiper.instances.push(this);
        }

        slideNext() {
            this.nextCalls += 1;
        }

        slidePrev() {
            this.previousCalls += 1;
        }

        slideToLoop(index, speed, runCallbacks) {
            this.slideToCalls.push({ index, speed, runCallbacks });
        }

        update() {}
    }

    global.window = {
        Swiper: FakeSwiper,
        WhatsAppModule: {
            createUrl: message => `whatsapp:${message}`
        },
        matchMedia: () => ({ matches: false })
    };
    global.document = {
        body: { classList: createClassList() },
        getElementById: id => ({
            promoModal: modal,
            closePromoModal: closeButton,
            promoCardStack: stack,
            promoModalDots: dots,
            promoModalWhatsappLink: whatsappLink
        })[id] || null,
        querySelectorAll: selector => selector === '.open-promo-btn' ? [] : [],
        addEventListener: (eventName, listener) => {
            if (eventName === 'keydown') keydownListeners.push(listener);
        }
    };

    delete require.cache[promoModulePath];
    require(promoModulePath);
    window.PromoModule.init();
    if (open) window.PromoModule.open();

    return {
        FakeSwiper,
        keydownListeners,
        module: window.PromoModule,
        stack,
        dots,
        whatsappLink
    };
}

afterEach(() => {
    delete require.cache[promoModulePath];
    delete global.document;
    delete global.window;
});

test('closed promos do not create or request flyer images', () => {
    const { FakeSwiper, stack } = loadPromoModule(false);
    assert.equal(stack.innerHTML, '');
    assert.equal(FakeSwiper.instances.length, 0);
});

test('opening promos creates a looping Swiper card deck', () => {
    const { FakeSwiper, stack } = loadPromoModule();

    assert.equal(FakeSwiper.instances.length, 1);
    assert.equal(FakeSwiper.instances[0].options.effect, 'cards');
    assert.equal(FakeSwiper.instances[0].options.loop, true);
    assert.match(stack.innerHTML, /swiper-wrapper/);
});

test('arrow keys move to the next and previous promo', () => {
    const { FakeSwiper, keydownListeners } = loadPromoModule();
    const swiper = FakeSwiper.instances[0];
    const keydown = keydownListeners[0];

    keydown({ key: 'ArrowRight', preventDefault: () => {} });
    keydown({ key: 'ArrowLeft', preventDefault: () => {} });

    assert.equal(swiper.nextCalls, 1);
    assert.equal(swiper.previousCalls, 1);
});

test('changing cards updates the active offer controls', () => {
    const { FakeSwiper, module, dots, whatsappLink } = loadPromoModule();
    const swiper = FakeSwiper.instances[0];

    swiper.realIndex = 2;
    swiper.options.on.slideChange(swiper);

    assert.equal(module.activeSlideIndex, 2);
    assert.match(whatsappLink.href, /White Water Adventure/);
    assert.match(dots.innerHTML, /aria-current="true"/);
});
