const project = project || {};

project.mainNav = (() => {

    return {

        init(element) {
            const view = this;
            view.el = element;

            view.variables();
            view.dummy();
        },

        variables() {
            const view = this;
        },

        dummy() {
            const view = this;

            console.log('mainNav');
        }
    }

});