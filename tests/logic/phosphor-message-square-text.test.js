const assert = require('node:assert/strict');

global.window = {};
global.document = {
    readyState: 'complete',
    querySelectorAll: function() { return []; }
};

require('../../assets/js/shared/phosphor-bridge.js');

const icon = {
    className: 'w-4 h-4 text-slate-500',
    innerHTML: 'placeholder',
    getAttribute: function(name) {
        return name === 'data-lucide' ? 'message-square-text' : null;
    },
    removeAttribute: function() {}
};

window.PhosphorBridge.convert(icon);

assert.match(icon.className, /\bph\b/, 'Enquire should use the regular Phosphor weight');
assert.match(icon.className, /\bph-chat-text\b/, 'Enquire should convert to the Phosphor chat text icon');
assert.match(icon.className, /\btext-base\b/, 'Enquire should preserve its intended icon size');
assert.equal(icon.innerHTML, '', 'converted icon should clear fallback content');

console.log('Enquire converts to a visible Phosphor chat text icon.');
