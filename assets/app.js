(function () {
  var navButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startHero() {
      stopHero();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }

    function stopHero() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var nextIndex = parseInt(dot.getAttribute('data-hero-dot'), 10);
        showSlide(nextIndex);
        startHero();
      });
    });

    hero.addEventListener('mouseenter', stopHero);
    hero.addEventListener('mouseleave', startHero);
    startHero();
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function matches(card, query, filters) {
    var text = [
      card.getAttribute('data-title'),
      card.getAttribute('data-region'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-year'),
      card.getAttribute('data-type'),
      card.getAttribute('data-category')
    ].join(' ').toLowerCase();

    if (query && text.indexOf(query) === -1) {
      return false;
    }

    if (filters.category && card.getAttribute('data-category') !== filters.category) {
      return false;
    }

    if (filters.type && card.getAttribute('data-type') !== filters.type) {
      return false;
    }

    if (filters.year && card.getAttribute('data-year') !== filters.year) {
      return false;
    }

    return true;
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
  var filterSelects = Array.prototype.slice.call(document.querySelectorAll('[data-filter-select]'));
  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-filter-grid]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function applyFilters() {
    if (!grids.length) {
      return;
    }

    var input = filterInputs[0];
    var query = normalize(input ? input.value : '');
    var filters = {};

    filterSelects.forEach(function (select) {
      filters[select.getAttribute('data-filter-select')] = select.value;
    });

    var visible = 0;

    grids.forEach(function (grid) {
      Array.prototype.slice.call(grid.querySelectorAll('[data-card]')).forEach(function (card) {
        var ok = matches(card, query, filters);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
    });

    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0);
    }
  }

  filterInputs.forEach(function (input) {
    input.addEventListener('input', applyFilters);
  });

  filterSelects.forEach(function (select) {
    select.addEventListener('change', applyFilters);
  });

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');

  if (initialQuery && filterInputs.length) {
    filterInputs[0].value = initialQuery;
    applyFilters();
  }
})();
