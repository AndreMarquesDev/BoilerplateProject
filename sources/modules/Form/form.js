const project = project || {};

project.form = (() => {

    return {

        init(element) {
            const view = this;
            view.el = element;

            view.variables();
            view.dummy();
        },

        variables() {
            const view = this;

            view.form = view.el.querySelector('form');
            view.formNotification = view.el.querySelector('.formNotification');
        },

        dummy() {
            const view = this;

            // console.log('form');
            // view.form.addEventListener('submit', event => {
            //     event && event.preventDefault();
            //     console.log('submitted');
            //     debugger
            // })
        }
    }

});