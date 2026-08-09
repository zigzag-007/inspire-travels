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
            }
        }
    };
})();
