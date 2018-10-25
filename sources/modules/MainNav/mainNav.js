var PROJETO = PROJETO || {};

PROJETO.CTABLOCK = (function () {

    return {

        init: function (element, data) {
            var view = this;
                view.el = $(element);
                view.variables();
                view.checkThemes();
        },

        variables: function () {
            var view = this;
                dataTheme = view.el.data('theme');
                ctaButtons = view.el.find('.btn');
        },

        checkThemes: function () {
            var view = this;

            // If 'data-theme' empty, primary-aqua or bold-aqua, remove any btns with
            // primary or secondary classes (don't fit) and add 'secondary-light' as
            // default (and if it wasn't 'highlight'); same logic applied to white and
            // light-grey themes;

            if (!dataTheme || dataTheme === "primary-aqua" || dataTheme === "bold-aqua") {
                ctaButtons.removeClass('primary secondary');
                ctaButtons.each(function() {
                    !$(this).hasClass('highlight') && $(this).addClass('secondary-light');
                });
            } else if (dataTheme === "white" || dataTheme === "light-grey") {
                ctaButtons.removeClass('secondary-light');
                ctaButtons.each(function() {
                    !$(this).is('.primary, .secondary, .highlight') && $(this).addClass('secondary');
                });
            }

        }
    }

});