const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const projectRoot = path.resolve(__dirname, '../..');
const aboutModule = fs.readFileSync(
    path.join(projectRoot, 'assets/js/home/about.js'),
    'utf8'
);
const tourTemplate = fs.readFileSync(
    path.join(projectRoot, 'assets/js/tours/tour-content-template.js'),
    'utf8'
);
const tourTabsModule = fs.readFileSync(
    path.join(projectRoot, 'assets/js/tours/tour-tabs.js'),
    'utf8'
);
const homePage = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

assert.match(
    homePage,
    /id="story-tab"[^>]*role="tab"[^>]*aria-selected="true"[^>]*aria-controls="story-content"/,
    'the story tab should expose its initial selected state and panel'
);
assert.match(
    homePage,
    /id="mission-tab"[^>]*role="tab"[^>]*aria-selected="false"[^>]*aria-controls="mission-content"/,
    'the mission tab should expose its initial selected state and panel'
);
function makeElement(id) {
    const attributes = {};
    const listeners = {};
    const classes = new Set();
    return {
        id,
        attributes,
        listeners,
        classList: {
            toggle: function(name, isActive) {
                if (isActive) classes.add(name);
                else classes.delete(name);
            },
            contains: function(name) {
                return classes.has(name);
            }
        },
        setAttribute: function(name, value) {
            attributes[name] = value;
        },
        addEventListener: function(name, listener) {
            listeners[name] = listener;
        },
        focus: function() {
            document.activeElement = this;
        }
    };
}

const document = {
    activeElement: null,
    elements: {
        'story-tab': makeElement('story-tab'),
        'mission-tab': makeElement('mission-tab'),
        'story-content': makeElement('story-content'),
        'mission-content': makeElement('mission-content'),
        'story-image': makeElement('story-image'),
        'mission-image': makeElement('mission-image')
    },
    getElementById: function(id) {
        return this.elements[id] || null;
    }
};
const window = {};
vm.runInNewContext(aboutModule, { window, document });
window.AboutModule.init();

const storyTab = document.elements['story-tab'];
const missionTab = document.elements['mission-tab'];
const storyContent = document.elements['story-content'];
const missionContent = document.elements['mission-content'];

assert.equal(storyTab.attributes.tabindex, '0', 'the selected About tab should be the only tab stop');
assert.equal(missionTab.attributes.tabindex, '-1', 'the inactive About tab should leave the tab order');
assert.equal(missionContent.classList.contains('hidden'), true, 'the inactive About panel should be hidden');

function pressTabKey(tab, key) {
    let prevented = false;
    tab.listeners.keydown({
        key,
        preventDefault: function() {
            prevented = true;
        }
    });
    return prevented;
}

assert.equal(pressTabKey(storyTab, 'ArrowRight'), true, 'ArrowRight should be handled');
assert.equal(document.activeElement, missionTab, 'ArrowRight should focus the next About tab');
assert.equal(missionTab.attributes['aria-selected'], 'true', 'ArrowRight should activate the next About tab');
assert.equal(missionTab.attributes.tabindex, '0', 'the active About tab should become the only tab stop');
assert.equal(storyContent.classList.contains('hidden'), true, 'the previous About panel should hide');
assert.equal(missionContent.classList.contains('hidden'), false, 'the next About panel should show');
assert.equal(pressTabKey(missionTab, 'ArrowRight'), true, 'ArrowRight should wrap to the first About tab');
assert.equal(document.activeElement, storyTab, 'ArrowRight should wrap focus to the first About tab');
assert.equal(pressTabKey(storyTab, 'End'), true, 'End should be handled');
assert.equal(document.activeElement, missionTab, 'End should focus the last About tab');
assert.equal(pressTabKey(missionTab, 'Home'), true, 'Home should be handled');
assert.equal(document.activeElement, storyTab, 'Home should focus the first About tab');
assert.equal(pressTabKey(storyTab, 'ArrowLeft'), true, 'ArrowLeft should wrap to the last About tab');
assert.equal(document.activeElement, missionTab, 'ArrowLeft should wrap focus to the last About tab');

assert.match(
    tourTemplate,
    /class="tour-detail-tabs-list[^>]*role="tablist"/,
    'tour tab controls should be grouped as a tab list'
);
assert.match(
    tourTemplate,
    /id="tab-btn-overview"[^>]*role="tab"[^>]*aria-selected="true"[^>]*aria-controls="tour-tab-panel-overview"/,
    'the overview tab should identify its initial selected state and panel'
);
assert.match(
    tourTemplate,
    /id="tour-tab-panel-overview"[^>]*role="tabpanel"[^>]*aria-labelledby="tab-btn-overview"/,
    'the overview panel should identify its controlling tab'
);
assert.match(
    tourTabsModule,
    /addEventListener\(['"]keydown['"]/,
    'tour tabs should respond to keyboard navigation'
);
assert.match(
    tourTabsModule,
    /^(?=[\s\S]*ArrowLeft)(?=[\s\S]*ArrowRight)(?=[\s\S]*Home)(?=[\s\S]*End)[\s\S]*$/,
    'tour tabs should support arrow and boundary key navigation'
);

console.log('About and tour tabs expose complete keyboard tab patterns.');
