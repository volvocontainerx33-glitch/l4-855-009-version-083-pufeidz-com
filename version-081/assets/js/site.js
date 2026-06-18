(function () {
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const backTop = document.querySelector('.back-top');

  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', window.scrollY > 360);
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  const filterRoot = document.querySelector('[data-filter-root]');

  if (filterRoot) {
    const input = filterRoot.querySelector('[data-filter-input]');
    const genreSelect = filterRoot.querySelector('[data-genre-select]');
    const yearSelect = filterRoot.querySelector('[data-year-select]');
    const regionSelect = filterRoot.querySelector('[data-region-select]');
    const resetButton = filterRoot.querySelector('[data-reset-filter]');
    const cards = Array.from(document.querySelectorAll('.movie-card'));
    const emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      const keyword = normalize(input ? input.value : '');
      const genre = normalize(genreSelect ? genreSelect.value : '');
      const year = normalize(yearSelect ? yearSelect.value : '');
      const region = normalize(regionSelect ? regionSelect.value : '');
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize(card.getAttribute('data-search'));
        const cardGenre = normalize(card.getAttribute('data-genre'));
        const cardYear = normalize(card.getAttribute('data-year'));
        const cardRegion = normalize(card.getAttribute('data-region'));
        const matched = (!keyword || haystack.includes(keyword)) &&
          (!genre || cardGenre.includes(genre)) &&
          (!year || cardYear === year) &&
          (!region || cardRegion.includes(region));

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('visible', visible === 0);
      }
    }

    [input, genreSelect, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (genreSelect) {
          genreSelect.value = '';
        }
        if (yearSelect) {
          yearSelect.value = '';
        }
        if (regionSelect) {
          regionSelect.value = '';
        }
        applyFilters();
      });
    }
  }
}());
