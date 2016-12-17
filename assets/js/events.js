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

    $(window).load(function() {
        var tooltipOtherFrameworks = $('.tooltip-other');
        var tooltipMultiText = $('.tooltip-multi-text');

        tooltipOtherFrameworks.mouseover(function(event) {

            var left = ($(this).offset().left - 20) + 'px';
            var top = ($(this).offset().top - tooltipMultiText.height() - 10) + 'px';
            tooltipMultiText.css({ visibility: 'visible', top: top, left: left });


        });
        tooltipOtherFrameworks.mouseout(function() {
            tooltipMultiText.css({ visibility: 'hidden' });
        });
    });

})(jQuery); // End of use strict