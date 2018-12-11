const project = project || {};

project.utils = (() => {

    return {

        init: function() {
            const view = this;

            view.polyfills();
        },

        polyfills: () => {
            // Matches polyfill
            if (!Element.prototype.matches) {
                Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    const matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
            }

            // Includes polyfill
            if (!Array.prototype.includes) {
                Array.prototype.includes = function() {
                    'use strict';
                    return Array.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }

            // Nodelist forEach polyfill
            if (window.NodeList && !NodeList.prototype.forEach) {
                NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (let i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, this);
                }
                };
            }

            // Closest polyfill
            if (!Element.prototype.closest) Element.prototype.closest = function(s) {
                let el = this,
                    ancestor = this;
                if (!document.documentElement.contains(el)) return null;
                    do {
                        if (ancestor.matches(s)) return ancestor;
                        ancestor = ancestor.parentElement;
                    } while (ancestor !== null);
                return null;
            };
        },

        initHover3D: (container, inner) => {
            // Setup

            // <div class="container">
            //     <div class="inner"></div>
            // </div>

            // .container {
            //     width: 500px;
            //     height: 500px;
            //     background: lightgreen;
            //     margin: auto auto 100px;
            //     position: relative;
            //     perspective: 40px;
            // }

            // .inner {
            //     width: 100%;
            //     height: 100%;
            //     background: rgb(42, 141, 173);
            //     box-shadow: $boxShadow;
            //     @include transition;
            //     perspective: 40px;
            // }

            // correr com project.utils().initHover3D(view.container, view.inner)

            const updateRate = 10;

            let centerX,
                centerY,
                x,
                y,
                counter = 0;

            const setOrigin = element => {
                centerX = element.offsetWidth / 2 + element.offsetLeft;
                centerY = element.offsetHeight / 2 + element.offsetTop;
            }

            const updateTransform = event => {
                event = event || window.event;
                x = event.clientX - centerX;
                y = -(event.clientY - centerY);
                inner.style.transform = `rotateX(${y / inner.offsetHeight / 2}deg) rotateY(${x / inner.offsetWidth / 2}deg)`;
            }

            const isTimeToUpdate = () => counter++ % updateRate === 0;

            // Allows to track the mouse position relatively to the center of the element
            setOrigin(container);

            event.type === 'mouseenter' && isTimeToUpdate() && updateTransform(event);
            event.type === 'mousemove' && updateTransform(event);
            event.type === 'mouseleave' && (inner.style = '');

            container.addEventListener('mouseenter', event => isTimeToUpdate() && updateTransform(event));
            container.addEventListener('mousemove', event => updateTransform(event));
            container.addEventListener('mouseleave', () => inner.style = '');
        }

    }

});