(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var list = document.querySelector('[data-filter-list]');
    var keyword = panel.querySelector('[data-filter-input]');
    var region = panel.querySelector('[data-filter-region]');
    var type = panel.querySelector('[data-filter-type]');
    var year = panel.querySelector('[data-filter-year]');
    var empty = panel.querySelector('[data-filter-empty]');

    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.children);
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (keyword && initial) {
      keyword.value = initial;
    }

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var q = valueOf(keyword);
      var r = valueOf(region);
      var t = valueOf(type);
      var y = valueOf(year);
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-text') || card.textContent || '').toLowerCase();
        var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
        var cardType = (card.getAttribute('data-type') || '').toLowerCase();
        var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
        var matched = true;

        if (q && text.indexOf(q) === -1) {
          matched = false;
        }

        if (r && cardRegion !== r) {
          matched = false;
        }

        if (t && cardType !== t) {
          matched = false;
        }

        if (y && cardYear !== y) {
          matched = false;
        }

        card.classList.toggle('is-hidden', !matched);

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [keyword, region, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  });
})();
