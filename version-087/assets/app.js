(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function normalize(text) {
    return String(text || "").toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector(".mobile-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      showSlide(0);
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var globalInputs = Array.prototype.slice.call(document.querySelectorAll(".global-search-input"));

    globalInputs.forEach(function (input) {
      var panel = input.parentElement.querySelector(".global-search-panel");

      input.addEventListener("input", function () {
        var query = normalize(input.value);
        panel.innerHTML = "";

        if (!query || typeof SITE_MOVIES === "undefined") {
          panel.classList.remove("show");
          return;
        }

        var results = SITE_MOVIES.filter(function (movie) {
          return normalize(movie.title + " " + movie.year + " " + movie.region + " " + movie.genre + " " + movie.type).indexOf(query) !== -1;
        }).slice(0, 12);

        if (!results.length) {
          var empty = document.createElement("div");
          empty.className = "search-result";
          empty.innerHTML = "<div></div><div><strong>暂无匹配内容</strong><span>换一个关键词继续查找</span></div>";
          panel.appendChild(empty);
          panel.classList.add("show");
          return;
        }

        results.forEach(function (movie) {
          var link = document.createElement("a");
          link.className = "search-result";
          link.href = movie.url;
          link.innerHTML = [
            '<img src="' + movie.cover + '" alt="' + movie.title + '">',
            "<div>",
            "<strong>" + movie.title + "</strong>",
            "<span>" + movie.year + " · " + movie.region + " · " + movie.genre + "</span>",
            "</div>"
          ].join("");
          panel.appendChild(link);
        });

        panel.classList.add("show");
      });
    });

    document.addEventListener("click", function (event) {
      document.querySelectorAll(".global-search-panel").forEach(function (panel) {
        if (!panel.parentElement.contains(event.target)) {
          panel.classList.remove("show");
        }
      });
    });

    var localInput = document.querySelector(".local-search");
    var yearSelect = document.querySelector(".year-filter");
    var regionSelect = document.querySelector(".region-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var emptyState = document.querySelector(".empty-state");

    function filterCards() {
      if (!cards.length) {
        return;
      }

      var query = normalize(localInput ? localInput.value : "");
      var year = yearSelect ? yearSelect.value : "";
      var region = regionSelect ? regionSelect.value : "";
      var shown = 0;

      cards.forEach(function (card) {
        var text = normalize(card.dataset.title + " " + card.dataset.genre + " " + card.dataset.region + " " + card.dataset.year);
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (year && card.dataset.year !== year) {
          matched = false;
        }

        if (region && card.dataset.region !== region) {
          matched = false;
        }

        card.classList.toggle("hidden-card", !matched);

        if (matched) {
          shown += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle("show", shown === 0);
      }
    }

    [localInput, yearSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });
  });
})();
