"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var project = project || {};

project.main = function () {
  return {
    init: function init(selector) {
      typeof selector == 'undefined' && (selector = '');
      $(selector + '[data-script]').not('[data-auto-init="false"]').each(function (index, elem) {
        var data = $(elem).data(),
            script = data.script;
        if (!project[script]) return;

        if (typeof project[script] === 'function') {
          var obj = new project[script]();
          obj.init(elem, data);
        } else if (_typeof(project[script]) === 'object') {
          project[script].init(elem, data);
        }
      });
    }
  };
}();

document.addEventListener('DOMContentLoaded', function () {
  project.main.init();
});