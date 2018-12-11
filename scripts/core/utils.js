"use strict";

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var project = project || {};

project.utils = function () {
  return {
    init: function init() {
      var view = this;
      view.polyfills();
    },
    polyfills: function polyfills() {
      // Matches polyfill
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i = matches.length;

          while ((_readOnlyError("i"), --i) >= 0 && matches.item(i) !== this) {}

          return i > -1;
        };
      } // Includes polyfill


      if (!Array.prototype.includes) {
        Array.prototype.includes = function () {
          'use strict';

          return Array.prototype.indexOf.apply(this, arguments) !== -1;
        };
      } // Nodelist forEach polyfill


      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
          thisArg = thisArg || window;

          for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
          }
        };
      } // Closest polyfill


      if (!Element.prototype.closest) Element.prototype.closest = function (s) {
        var el = this,
            ancestor = this;
        if (!document.documentElement.contains(el)) return null;

        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);

        return null;
      };
    },
    initHover3D: function initHover3D(container, inner) {
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
      var updateRate = 10;
      var centerX,
          centerY,
          x,
          y,
          counter = 0;

      var setOrigin = function setOrigin(element) {
        centerX = element.offsetWidth / 2 + element.offsetLeft;
        centerY = element.offsetHeight / 2 + element.offsetTop;
      };

      var updateTransform = function updateTransform(event) {
        event = event || window.event;
        x = event.clientX - centerX;
        y = -(event.clientY - centerY);
        inner.style.transform = "rotateX(".concat(y / inner.offsetHeight / 2, "deg) rotateY(").concat(x / inner.offsetWidth / 2, "deg)");
      };

      var isTimeToUpdate = function isTimeToUpdate() {
        return counter++ % updateRate === 0;
      }; // Allows to track the mouse position relatively to the center of the element


      setOrigin(container);
      event.type === 'mouseenter' && isTimeToUpdate() && updateTransform(event);
      event.type === 'mousemove' && updateTransform(event);
      event.type === 'mouseleave' && (inner.style = '');
      container.addEventListener('mouseenter', function (event) {
        return isTimeToUpdate() && updateTransform(event);
      });
      container.addEventListener('mousemove', function (event) {
        return updateTransform(event);
      });
      container.addEventListener('mouseleave', function () {
        return inner.style = '';
      });
    }
  };
};