"use strict";

var project = project || {};

project.form = function () {
  return {
    init: function init(element) {
      var view = this;
      view.el = element;
      view.variables();
      view.dummy();
    },
    variables: function variables() {
      var view = this;
    },
    dummy: function dummy() {
      var view = this;
      console.log('form');
    }
  };
};