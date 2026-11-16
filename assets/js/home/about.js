// About Module - Controls about section tab functionality
// Author: Zig Zag AI
// Description: Manages about section tab switching between story and mission content

(function() {
    'use strict';

    window.AboutModule = {
        storyTab: null,
        missionTab: null,
        storyContent: null,
        missionContent: null,
        storyImage: null,
        missionImage: null,

        init: function() {
            this.storyTab = document.getElementById('story-tab');
            this.missionTab = document.getElementById('mission-tab');
            this.storyContent = document.getElementById('story-content');
            this.missionContent = document.getElementById('mission-content');
            this.storyImage = document.getElementById('story-image');
            this.missionImage = document.getElementById('mission-image');

            this.initTabSwitching();
        },

        setActiveTab: function(tabName) {
            const isStoryActive = tabName === 'story';

            this.storyTab.classList.toggle('is-active', isStoryActive);
            this.missionTab.classList.toggle('is-active', !isStoryActive);
            this.storyTab.setAttribute('aria-selected', String(isStoryActive));
            this.missionTab.setAttribute('aria-selected', String(!isStoryActive));
            this.storyTab.setAttribute('tabindex', isStoryActive ? '0' : '-1');
            this.missionTab.setAttribute('tabindex', isStoryActive ? '-1' : '0');

            this.storyContent.classList.toggle('hidden', !isStoryActive);
            this.missionContent.classList.toggle('hidden', isStoryActive);

            if (this.storyImage && this.missionImage) {
                this.storyImage.classList.toggle('hidden', !isStoryActive);
                this.missionImage.classList.toggle('hidden', isStoryActive);
            }
        },

        initTabSwitching: function() {
            if (this.storyTab && this.missionTab) {
                this.setActiveTab('story');

                this.storyTab.addEventListener('click', () => {
                    this.setActiveTab('story');
                });

                this.missionTab.addEventListener('click', () => {
                    this.setActiveTab('mission');
                });

                this.storyTab.addEventListener('keydown', event => {
                    this.handleTabKeydown(event, 'story');
                });

                this.missionTab.addEventListener('keydown', event => {
                    this.handleTabKeydown(event, 'mission');
                });
            }
        },

        // Move focus and selection together so the tab list has one tab stop.
        handleTabKeydown: function(event, currentTab) {
            const tabs = [
                { name: 'story', element: this.storyTab },
                { name: 'mission', element: this.missionTab }
            ];
            const currentIndex = tabs.findIndex(tab => tab.name === currentTab);
            let nextIndex = currentIndex;

            if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = tabs.length - 1;
            else return;

            event.preventDefault();
            this.setActiveTab(tabs[nextIndex].name);
            tabs[nextIndex].element.focus();
        }
    };
})();
