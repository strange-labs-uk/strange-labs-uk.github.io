/*!
 * Start Bootstrap - Creative Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Fit Text Plugin for Main Header
    $("h1").fitText(
        1.2, {
            minFontSize: '35px',
            maxFontSize: '65px'
        }
    );

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    // Initialize WOW.js Scrolling Animations
    new WOW().init();

    // Lazy load gallery images into modals only when opened
    $(document).ready(function() {
        // When a modal is shown
        $('.portfolio-modal').on('show.bs.modal', function (event) {
            var $modal = $(this);
            var $gallery = $modal.find('.gallery-images-placeholder');
            var images = $gallery.data('images');
            if (typeof images === 'string') {
                try {
                    images = JSON.parse(images);
                } catch (e) {
                    images = [];
                }
            }
            // Only inject if not already injected
            if ($gallery.children().length === 0 && Array.isArray(images)) {
                images.forEach(function(img) {
                    var $img = $('<img>', {
                        src: 'images/portfolio/' + img,
                        class: 'img-responsive img-centered gallery',
                        alt: ''
                    });
                    $gallery.append($img);
                });
            }
        });
        // When a modal is hidden, clear the images
        $('.portfolio-modal').on('hidden.bs.modal', function (event) {
            var $modal = $(this);
            var $gallery = $modal.find('.gallery-images-placeholder');
            $gallery.empty();
        });
    });

})(jQuery); // End of use strict
