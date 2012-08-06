/**
 * Lazy Load Images without jQuery
 * An uncool, but totally searchable name for a totally useful plugin.
 *
 * (c) 2012 Mike Pulaski. http://www.mikepulaski.com ~ Feel free to reuse. <3
 * Modified and maintained by Yifei Zhang. http://yifei.co
 */

(function() {
  var addEventListener =  window.addEventListener || function(n,f) { window.attachEvent('on'+n, f); };
  var removeEventListener = window.removeEventListener || function(n,f,b) { window.detachEvent('on'+n, f); };

  var lazyLoader = {
    cache: [],
    mobileScreenSize: 500,
    tinyGif: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',

    addObservers: function() {
      addEventListener('scroll', lazyLoader.loadVisibleImages);
      addEventListener('resize', lazyLoader.loadVisibleImages);
    },

    removeObservers: function() {
      removeEventListener('scroll', lazyLoader.loadVisibleImages, false);
      removeEventListener('resize', lazyLoader.loadVisibleImages, false);
    },

    loadVisibleImages: function() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var pageHeight = window.innerHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);
      var range = {
        min: scrollY,
        max: scrollY + pageHeight
      };

      var i = 0;
      while (i < lazyLoader.cache.length) {
        var image = lazyLoader.cache[i];
        var imagePosition = image.offsetTop;
        var imageHeight = image.height || 0;

        if ((imagePosition >= range.min - imageHeight) && (imagePosition <= range.max)) {
          var mobileSrc = image.getAttribute('data-src-mobile');

          if (mobileSrc && screen.width <= lazyLoader.mobileScreenSize) {
            image.src = mobileSrc;
          }
          else {
            image.src = image.getAttribute('data-src');
          }

          image.removeAttribute('data-src');
          image.removeAttribute('data-src-mobile');
          image.className = 'lazy-loaded';

          lazyLoader.cache.splice(i, 1);
          continue;
        }

        i++;
      }

      if (lazyLoader.cache.length === 0) {
        lazyLoader.removeObservers();
      }
    },

    init: function() {
      // Patch IE7- (querySelectorAll)
      if (!document.querySelectorAll) {
        document.querySelectorAll = function(selector) {
          var doc = document,
              head = doc.documentElement.firstChild,
              styleTag = doc.createElement('STYLE');
          head.appendChild(styleTag);
          doc.__qsaels = [];
          styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
          window.scrollBy(0, 0);
          return doc.__qsaels;
        }
      }

      addEventListener('load', function _lazyLoaderInit() {
        var imageNodes = document.querySelectorAll('img[data-src]');

        for (var i = 0; i < imageNodes.length; i++) {
          var imageNode = imageNodes[i];

          // Add a placeholder if one doesn't exist
          imageNode.src = imageNode.src || lazyLoader.tiny_gif;

          lazyLoader.cache.push(imageNode);
        }

        lazyLoader.addObservers();
        lazyLoader.loadVisibleImages();

        removeEventListener('load', _lazyLoaderInit, false);
      });
    }
  }

  lazyLoader.init();
})();
