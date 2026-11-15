(function () {
    'use strict';

    // Use current trip records so the proposal does not invent an itinerary.
    var tours = window.TourDataModule.tourData;
    var root = '../../';
    var previews = [
        { slug: 'highlights-escape', image: 'assets/img/gallery/main/tea-plantation-tour.jpeg', alt: 'Guests and a guide among Sri Lankan tea plants', route: 'Kandy, Nuwara Eliya, Bentota and Colombo' },
        { slug: 'hills-to-beach', image: 'assets/img/gallery/main/mirissa-coconut-tree-hill.jpg', alt: 'Guests with a guide on a palm lined Sri Lankan coast', route: 'Sigiriya, Trincomalee, Kandy, Ella and Mirissa' },
        { slug: 'grand-tour', image: 'assets/img/gallery/main/sigiriya-lion-rock.jpg', alt: 'Guests and a guide beside Sri Lankan heritage ruins', route: 'Sigiriya, Kandy, Ella, Yala and the south coast' }
    ];

    // All text stays escaped even when the source records contain punctuation.
    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
        });
    }

    var grid = document.getElementById('review-trips');
    if (grid) {
        grid.innerHTML = previews.map(function (preview) {
            var tour = tours.find(function (record) { return record.slug === preview.slug; });
            var href = root + 'tours/' + tour.slug + '.html';
            return '<article class="trip-card"><a class="trip-photo" href="' + href + '" aria-label="View ' + escapeHtml(tour.title) + '">' +
                '<img src="' + root + preview.image + '" alt="' + escapeHtml(preview.alt) + '" width="800" height="600" decoding="async"></a>' +
                '<p class="trip-duration">' + escapeHtml(tour.duration.toLowerCase() + ', ' + tour.nights.toLowerCase()) + '</p>' +
                '<h2>' + escapeHtml(tour.title) + '</h2><p class="trip-route">' + escapeHtml(preview.route) + '</p>' +
                '<a class="text-link" href="' + href + '">See itinerary <span aria-hidden="true">↗</span></a></article>';
        }).join('');
    }

    var days = document.getElementById('review-days');
    if (days) {
        var tour = tours.find(function (record) { return record.slug === 'highlights-escape'; });
        days.innerHTML = tour.days.map(function (day) {
            var detail = day.overnight ? 'Overnight in ' + day.overnight : 'Airport transfer and departure';
            return '<li><span class="day-label">' + escapeHtml(day.label) + '</span><div><h3>' + escapeHtml(day.title) + '</h3><p>' + escapeHtml(detail) + '</p></div></li>';
        }).join('');
    }

    window.DesignReviewModule = { escapeHtml: escapeHtml };
})();
