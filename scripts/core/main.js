"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

'serviceWorker' in navigator && navigator.serviceWorker.register('serviceWorker.js');
var project = project || {};

project.main = function () {
  return {
    init: function init(selector) {
      project.utils().init();
      typeof selector == 'undefined' && (selector = '');
      document.querySelectorAll("".concat(selector, "[data-script]:not([data-auto-init=\"false\"])")).forEach(function (element) {
        var script = element.dataset.script;
        if (!project[script]) return;

        if (typeof project[script] === 'function') {
          var scriptsObject = new project[script]();
          scriptsObject.init(element);
        } else if (_typeof(project[script]) === 'object') project[script].init(element);
      });
    }
  };
};

document.addEventListener('DOMContentLoaded', function () {
  return project.main().init();
});