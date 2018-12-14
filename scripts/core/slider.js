"use strict";

var project = project || {};

project.slider = function () {
  return {
    init: function init(element) {
      var view = this;
      view.$el = $(element);
      view.el = element;
      view.variables(); // view.events();
      // view.initSlider();
      // new Glide('.glide').mount();

      new Glide('#teste1', {
        type: 'carousel',
        perView: 3,
        focusAt: 'center',
        gap: 40
      }).mount(); // new Glide('#teste2', {
      //     type: 'carousel',
      //     perView: 1,
      //     // focusAt: 'center',
      //     gap: 10
      // }).mount();

      document.querySelectorAll('.glide__slides li').forEach(function (element) {
        return element.style.width = '';
      });
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
      view.sliderContainer = view.$el.find('.slider__sliderContainer'); // Stop Youtube videos from autoplaying on init (because the 'autoplay' option might be in the url unintendedly) except for currentSlide

      view.sliderContainer.on('init', function () {
        view.el.querySelectorAll('iframe').forEach(function (element) {
          element.closest('.slick-current') ? window.innerWidth > 767 && view.playYoutube(element) : view.pauseYoutube(element);
        });
      });
      view.sliderContainer.slick({
        slidesToShow: 3,
        centerMode: true,
        variableWidth: true
      }).on('beforeChange', function () {
        !!view.el.querySelector('.slick-current video') && view.el.querySelector('.slick-current video').pause();
        !!view.el.querySelector('.slick-current iframe') && view.pauseYoutube(view.el.querySelector('.slick-current iframe'));
      }).on('afterChange', function () {
        !!view.el.querySelector('.slick-current video') && window.innerWidth > 767 && view.el.querySelector('.slick-current video').play();
        !!view.el.querySelector('.slick-current iframe') && window.innerWidth > 767 && view.playYoutube(view.el.querySelector('.slick-current iframe'));
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
      var video = view.el.querySelector('.slick-current video');
      if (video && window.innerWidth > 767) view.isInViewport(video) ? (console.log('playVideo'), !view.wasAutoplayed && (video.play(), view.wasAutoplayed = true)) : (console.log('pauseVideo'), video.pause());
      var iframe = view.el.querySelector('.slick-current iframe');
      if (iframe && window.innerWidth > 767) view.isInViewport(iframe) ? !view.wasAutoplayed && (view.playYoutube(iframe), view.wasAutoplayed = true) : view.pauseYoutube(iframe);
    }
  };
};