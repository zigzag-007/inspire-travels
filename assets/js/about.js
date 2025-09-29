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

        initTabSwitching: function() {
            if (this.storyTab && this.missionTab) {
                this.storyTab.addEventListener('click', () => {
                    // Update tab states - use liquid glass active styling with higher intensity
                    this.storyTab.classList.add('bg-white/30');
                    this.storyTab.classList.remove('bg-white/10');
                    this.missionTab.classList.remove('bg-white/30');
                    this.missionTab.classList.add('bg-white/10');

                    // Update content
                    this.storyContent.classList.remove('hidden');
                    this.missionContent.classList.add('hidden');

                    // Update images
                    if (this.storyImage && this.missionImage) {
                        this.storyImage.classList.remove('hidden');
                        this.missionImage.classList.add('hidden');
                    }
                });

                this.missionTab.addEventListener('click', () => {
                    // Update tab states - use liquid glass active styling with higher intensity
                    this.missionTab.classList.add('bg-white/30');
                    this.missionTab.classList.remove('bg-white/10');
                    this.storyTab.classList.remove('bg-white/30');
                    this.storyTab.classList.add('bg-white/10');

                    // Update content
                    this.missionContent.classList.remove('hidden');
                    this.storyContent.classList.add('hidden');

                    // Update images
                    if (this.storyImage && this.missionImage) {
                        this.missionImage.classList.remove('hidden');
                        this.storyImage.classList.add('hidden');
                    }
                });
            }
        }
    };
})();
