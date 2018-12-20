if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/serviceWorker.js')
        .then(() => console.log('Service Worker registered'));
}

const project = project || {};

project.main = () => {

    return {
        init(selector) {
            project.utils().init();

            (typeof selector == 'undefined') && (selector = '');

            document.querySelectorAll(`${selector}[data-script]:not([data-auto-init="false"])`).forEach(element => {
                const script = element.dataset.script;

                if (!project[script]) return;

                if (typeof project[script] === 'function') {
                    const scriptsObject = new project[script];
                    scriptsObject.init(element);
                } else if (typeof project[script] === 'object') project[script].init(element);
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => project.main().init());