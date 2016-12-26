(function($) {
    "use strict"; // Start of use strict

    // Animate loader off screen
    $(".se-pre-con").fadeOut("slow");
    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1250, 'easeInOutExpo');
    });

})(jQuery); // End of use strict