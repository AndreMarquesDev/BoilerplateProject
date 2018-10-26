let project = project || {};

project.main = (() => {

    return {
        init: (selector) => {
            (typeof selector == 'undefined') && (selector = '');

            $(selector + '[data-script]').not('[data-auto-init="false"]').each((index, elem) => {
                const data = $(elem).data(),
                      script = data.script;

                if (!project[script]) return;

                if (typeof project[script] === 'function') {
                    const obj = new project[script];
                    obj.init(elem, data);
                } else if (typeof project[script] === 'object') {
                    project[script].init(elem, data);
                }
            });
        }
    }
}) ();

document.addEventListener('DOMContentLoaded', () => {
    project.main.init();
});