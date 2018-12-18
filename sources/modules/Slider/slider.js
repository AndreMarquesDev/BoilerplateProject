const project = project || {};

project.slider = (() => {

    return {

        init(element) {
            const view = this;
            view.el = element;

            view.variables();
            view.events();
            view.initSlider();
        },

        variables() {
            const view = this;

            view.wasAutoplayed = false;
        },

        events() {
            const view = this;

            window.addEventListener('resize', () => view.playWhenVisible())
            window.addEventListener('scroll', () => view.playWhenVisible())
        },

        initSlider() {
            const view = this;

            const slider = new Flickity(view.el.querySelector('ul'), {
                wrapAround: true,
                imagesLoaded: true,
                pageDots: false,
                arrowShape: {
                    x0: 10,
                    x1: 60, y1: 50,
                    x2: 65, y2: 45,
                    x3: 20
                }
            });

            // Stop Youtube videos from autoplaying on init (because the 'autoplay' option might be in the url unintendedly) except for currentSlide
            slider.on('ready', () => view.el.querySelectorAll('iframe').forEach(element => {
                element.closest('.is-selected')
                    ? window.innerWidth > 767 && view.playYoutube(element)
                    : view.pauseYoutube(element);
            }));

            slider.on('change', () => {
                view.el.querySelectorAll('li:not(.is-selected) iframe').forEach(element => view.pauseYoutube(element));
                const currentYTVideo = view.el.querySelector('.is-selected iframe')
                !!currentYTVideo && view.playYoutube(currentYTVideo);

                view.el.querySelectorAll('li:not(.is-selected) video').forEach(element => element.pause());
                const currentVideo = view.el.querySelector('.is-selected video');
                !!currentVideo && currentVideo.play();
            });

        },

        playYoutube(video) {
            const videoURL = video.getAttribute('src');
            video && !/autoplay=1/i.test(videoURL) && video.setAttribute('src', videoURL.replace('autoplay=0', 'autoplay=1'));
        },

        pauseYoutube(video) {
            const videoURL = video.getAttribute('src');
            video && /autoplay=1/i.test(videoURL) && video.setAttribute('src', videoURL.replace('autoplay=1', 'autoplay=0'));
        },

        isInViewport(element) {
            const elementTop = element.getBoundingClientRect().top + element.offsetHeight,
                elementBottom = elementTop + element.offsetHeight,
                viewportTop = window.scrollY,
                viewportBottom = viewportTop + window.innerHeight;
            return elementBottom > viewportTop && elementTop < viewportBottom;
        },

        playWhenVisible() {
            const view = this;

            const video = view.el.querySelector('.is-selected video');
            if (video && window.innerWidth > 767) view.isInViewport(video)
                ? !view.wasAutoplayed && (video.play(), view.wasAutoplayed = true)
                : video.pause();

            const iframe = view.el.querySelector('.is-selected iframe');
            if (iframe && window.innerWidth > 767) view.isInViewport(iframe)
                ? !view.wasAutoplayed && (view.playYoutube(iframe), view.wasAutoplayed = true)
                : view.pauseYoutube(iframe);

        }

    }

});