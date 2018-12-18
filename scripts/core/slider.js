"use strict";

var project = project || {};

project.slider = function () {
  return {
    init: function init(element) {
      var view = this;
      view.el = element;
      view.variables();
      view.events();
      view.initSlider();
    },
    variables: function variables() {
      var view = this;
      view.wasAutoplayed = false;
    },
    events: function events() {
      var view = this;
      window.addEventListener('resize', function () {
        return view.playWhenVisible();
      });
      window.addEventListener('scroll', function () {
        return view.playWhenVisible();
      });
    },
    initSlider: function initSlider() {
      var view = this;
      var slider = new Flickity(view.el.querySelector('ul'), {
        wrapAround: true,
        imagesLoaded: true,
        pageDots: false,
        arrowShape: {
          x0: 10,
          x1: 60,
          y1: 50,
          x2: 65,
          y2: 45,
          x3: 20
        }
      }); // Stop Youtube videos from autoplaying on init (because the 'autoplay' option might be in the url unintendedly) except for currentSlide

      slider.on('ready', function () {
        return view.el.querySelectorAll('iframe').forEach(function (element) {
          element.closest('.is-selected') ? window.innerWidth > 767 && view.playYoutube(element) : view.pauseYoutube(element);
        });
      });
      slider.on('change', function () {
        view.el.querySelectorAll('li:not(.is-selected) iframe').forEach(function (element) {
          return view.pauseYoutube(element);
        });
        var currentYTVideo = view.el.querySelector('.is-selected iframe');
        !!currentYTVideo && view.playYoutube(currentYTVideo);
        view.el.querySelectorAll('li:not(.is-selected) video').forEach(function (element) {
          return element.pause();
        });
        var currentVideo = view.el.querySelector('.is-selected video');
        !!currentVideo && currentVideo.play();
      });
    },
    playYoutube: function playYoutube(video) {
      var videoURL = video.getAttribute('src');
      video && !/autoplay=1/i.test(videoURL) && video.setAttribute('src', videoURL.replace('autoplay=0', 'autoplay=1'));
    },
    pauseYoutube: function pauseYoutube(video) {
      var videoURL = video.getAttribute('src');
      video && /autoplay=1/i.test(videoURL) && video.setAttribute('src', videoURL.replace('autoplay=1', 'autoplay=0'));
    },
    isInViewport: function isInViewport(element) {
      var elementTop = element.getBoundingClientRect().top + element.offsetHeight,
          elementBottom = elementTop + element.offsetHeight,
          viewportTop = window.scrollY,
          viewportBottom = viewportTop + window.innerHeight;
      return elementBottom > viewportTop && elementTop < viewportBottom;
    },
    playWhenVisible: function playWhenVisible() {
      var view = this;
      var video = view.el.querySelector('.is-selected video');
      if (video && window.innerWidth > 767) view.isInViewport(video) ? !view.wasAutoplayed && (video.play(), view.wasAutoplayed = true) : video.pause();
      var iframe = view.el.querySelector('.is-selected iframe');
      if (iframe && window.innerWidth > 767) view.isInViewport(iframe) ? !view.wasAutoplayed && (view.playYoutube(iframe), view.wasAutoplayed = true) : view.pauseYoutube(iframe);
    }
  };
};