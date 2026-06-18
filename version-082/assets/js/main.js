(function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let current = 0;
    let timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === current);
        });
    }

    function startCarousel() {
        if (timer) {
            clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
            startCarousel();
        });
    });

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(current - 1);
            startCarousel();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(current + 1);
            startCarousel();
        });
    }

    startCarousel();

    const searchInput = document.querySelector('[data-site-search]');
    const typeFilter = document.querySelector('[data-filter-type]');
    const cards = Array.from(document.querySelectorAll('.searchable-area .movie-card, .searchable-area.rank-list .movie-card'));

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function applyFilter() {
        const query = normalize(searchInput ? searchInput.value : '');
        const type = normalize(typeFilter ? typeFilter.value : '');

        cards.forEach(function (card) {
            const haystack = normalize([
                card.dataset.title,
                card.dataset.tags,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type
            ].join(' '));
            const matchedQuery = !query || haystack.indexOf(query) !== -1;
            const matchedType = !type || normalize(card.dataset.type).indexOf(type) !== -1;
            card.classList.toggle('is-hidden', !(matchedQuery && matchedType));
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilter);
    }
})();
