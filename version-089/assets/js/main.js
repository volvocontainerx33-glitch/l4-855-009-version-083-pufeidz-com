(function () {
    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function setupMobileNav() {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!toggle || !nav) {
            return;
        }

        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupImageFallback() {
        document.addEventListener('error', function (event) {
            var target = event.target;
            if (!target || target.tagName !== 'IMG') {
                return;
            }

            var frame = target.closest('.poster-frame');
            if (frame) {
                frame.classList.add('poster-fallback');
                target.style.display = 'none';
            }
        }, true);
    }

    function setupFilters() {
        var scopes = document.querySelectorAll('[data-filter-scope]');
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-filter-input]');
            var category = scope.querySelector('[data-filter-category]');
            var year = scope.querySelector('[data-filter-year]');
            var reset = scope.querySelector('[data-filter-reset]');
            var count = scope.querySelector('[data-filter-count]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));

            function yearMatches(cardYear, selectedYear) {
                if (!selectedYear) {
                    return true;
                }
                if (selectedYear === '2022') {
                    var numericYear = parseInt(cardYear, 10);
                    return !Number.isNaN(numericYear) && numericYear <= 2022;
                }
                return cardYear.indexOf(selectedYear) !== -1;
            }

            function applyFilter() {
                var query = normalize(input ? input.value : '');
                var selectedCategory = normalize(category ? category.value : '');
                var selectedYear = normalize(year ? year.value : '');
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-search-content'));
                    var cardCategory = normalize(card.getAttribute('data-category'));
                    var cardYear = normalize(card.getAttribute('data-year'));
                    var matched = true;

                    if (query && haystack.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (selectedCategory && cardCategory !== selectedCategory) {
                        matched = false;
                    }
                    if (!yearMatches(cardYear, selectedYear)) {
                        matched = false;
                    }

                    card.classList.toggle('is-hidden-by-filter', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (count) {
                    count.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 条内容';
                }
            }

            if (input) {
                input.addEventListener('input', applyFilter);
            }
            if (category) {
                category.addEventListener('change', applyFilter);
            }
            if (year) {
                year.addEventListener('change', applyFilter);
            }
            if (reset) {
                reset.addEventListener('click', function () {
                    if (input) {
                        input.value = '';
                    }
                    if (category) {
                        category.value = '';
                    }
                    if (year) {
                        year.value = '';
                    }
                    applyFilter();
                });
            }

            applyFilter();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupImageFallback();
        setupFilters();
    });
})();
