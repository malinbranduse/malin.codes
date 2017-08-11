let defaults = {
    header: '',
    stickyOffset: 300,
    classes: {
        sticky: 'sticky',
        transition: 'transition',
        visible: 'visible'
    }
};

// Entry point
export default function(options) {

    let _ = $.extend(defaults, options);

    let headerHeight = _.header.height();

    scrollHelper.callbackDown = function(offsetTop) {

        if (offsetTop >= _.stickyOffset) {

            _.header.addClass(_.classes.transition).removeClass(_.classes.visible);
            setTimeout(() => _.header.addClass(_.classes.sticky), 200);

        }
    };

    scrollHelper.callbackUp = function(offsetTop) {

        if (offsetTop >= _.stickyOffset) {

            _.header.addClass(_.classes.visible);

        } else {

            _.header.removeClass(_.classes.visible);

            //In case the scrolling up finishes faster than the animation (200ms timeout)
            if(offsetTop <= headerHeight) {

                _.header.removeClass(_.classes.transition).removeClass(_.classes.sticky);

            } else {
                setTimeout(() => {
                    _.header.removeClass(_.classes.transition).removeClass(_.classes.sticky);
                }, 200);
            }
        }
    };

    scrollHelper.scroll();

};

let scrollHelper = {

    lastScroll: -1,
    callbackUp: '',
    callbackDown: '',

    rAF: window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    // IE Fallback
    function(callback){ window.onscroll = callback; },

    scroll() {

        // Prevent extra calculations
        if(scrollHelper.lastScroll !== window.pageYOffset) {

            // Going up/down
            if (window.pageYOffset > scrollHelper.lastScroll)
                scrollHelper.callbackDown(window.pageYOffset);
            else
                scrollHelper.callbackUp(window.pageYOffset);

            scrollHelper.lastScroll = window.pageYOffset;

        } else {
            scrollHelper.rAF.call(window, scrollHelper.scroll);
            return false;
        }

        scrollHelper.rAF.call(window, scrollHelper.scroll);
    }

};