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
      view.form = view.el.querySelector('form');
      view.formNotification = view.el.querySelector('.formNotification');
    },
    dummy: function dummy() {
      var view = this; // console.log('form');
      // view.form.addEventListener('submit', event => {
      //     event && event.preventDefault();
      //     console.log('submitted');
      //     debugger
      // })
    }
  };
};