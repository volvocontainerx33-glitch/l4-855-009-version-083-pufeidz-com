(function () {
  var body = document.body;
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var prev = document.querySelector('.hero-prev');
  var next = document.querySelector('.hero-next');
  var active = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === active);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === active);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(active - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(active + 1);
      startHero();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  var heroSearch = document.querySelector('[data-hero-search]');
  if (heroSearch) {
    heroSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var keyword = heroSearch.querySelector('input[name="q"]').value.trim();
      var category = heroSearch.querySelector('select[name="cat"]').value;
      var year = heroSearch.querySelector('select[name="year"]').value;
      if (category && !keyword && !year) {
        window.location.href = 'category-' + category + '.html';
        return;
      }
      var params = new URLSearchParams();
      if (keyword) {
        params.set('q', keyword);
      }
      if (category) {
        params.set('cat', category);
      }
      if (year) {
        params.set('year', year);
      }
      window.location.href = 'search.html' + (params.toString() ? '?' + params.toString() : '');
    });
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    var scopeSelector = panel.getAttribute('data-filter-panel');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    if (!scope) {
      return;
    }
    var input = panel.querySelector('[data-filter-keyword]');
    var category = panel.querySelector('[data-filter-category]');
    var region = panel.querySelector('[data-filter-region]');
    var genre = panel.querySelector('[data-filter-genre]');
    var year = panel.querySelector('[data-filter-year]');
    var reset = panel.querySelector('[data-filter-reset]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .compact-card'));
    var empty = document.querySelector('[data-no-result]');

    function normalize(value) {
      return String(value || '').toLowerCase();
    }

    function match(card) {
      var keyword = normalize(input && input.value);
      var categoryValue = normalize(category && category.value);
      var regionValue = normalize(region && region.value);
      var genreValue = normalize(genre && genre.value);
      var yearValue = normalize(year && year.value);
      var cardText = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' '));
      var ok = true;
      if (keyword) {
        ok = ok && cardText.indexOf(keyword) !== -1;
      }
      if (categoryValue) {
        ok = ok && normalize(card.getAttribute('data-category')) === categoryValue;
      }
      if (regionValue) {
        ok = ok && normalize(card.getAttribute('data-region')).indexOf(regionValue) !== -1;
      }
      if (genreValue) {
        ok = ok && normalize(card.getAttribute('data-genre')).indexOf(genreValue) !== -1;
      }
      if (yearValue) {
        ok = ok && normalize(card.getAttribute('data-year')) === yearValue;
      }
      return ok;
    }

    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var isMatch = match(card);
        card.style.display = isMatch ? '' : 'none';
        if (isMatch) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-show', shown === 0);
      }
    }

    [input, category, region, genre, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        if (input) input.value = '';
        if (category) category.value = '';
        if (region) region.value = '';
        if (genre) genre.value = '';
        if (year) year.value = '';
        apply();
      });
    }

    var params = new URLSearchParams(window.location.search);
    if (input && params.get('q')) {
      input.value = params.get('q');
    }
    if (category && params.get('cat')) {
      category.value = params.get('cat');
    }
    if (region && params.get('region')) {
      region.value = params.get('region');
    }
    if (genre && params.get('genre')) {
      genre.value = params.get('genre');
    }
    if (year && params.get('year')) {
      year.value = params.get('year');
    }
    apply();
  });
})();
