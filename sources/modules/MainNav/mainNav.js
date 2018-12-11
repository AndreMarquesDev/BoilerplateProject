const project = project || {};

project.mainNav = (() => {

    return {

        init: function(element) {
            const view = this;
            view.el = element;

            view.variables();
            view.dummy();
        },

        variables: function() {
            const view = this;
        },

        dummy: function() {
            const view = this;

            console.log('mainNav');
        }
    }

});