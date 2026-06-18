(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  var navButton = document.querySelector("[data-nav-toggle]");
  if (navButton) {
    navButton.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
  }

  all(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
  });

  var backTop = document.querySelector("[data-back-top]");
  if (backTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 520) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = all("[data-hero-slide]", hero);
    var dots = all("[data-hero-dot]", hero);
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === active);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });

    if (slides.length > 1) {
      start();
    }
  }

  all("[data-filter-root]").forEach(function (panel) {
    var scope = panel.parentElement || document;
    var cards = all("[data-card]", scope);
    var input = panel.querySelector("[data-search-input]");
    var filters = all("[data-filter]", panel);
    var empty = scope.querySelector("[data-empty-state]");

    function apply() {
      var query = text(input ? input.value : "");
      var values = {};
      filters.forEach(function (select) {
        values[select.getAttribute("data-filter")] = text(select.value);
      });
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = text(card.getAttribute("data-search"));
        var pass = !query || haystack.indexOf(query) !== -1;
        Object.keys(values).forEach(function (key) {
          if (values[key] && text(card.getAttribute("data-" + key)) !== values[key]) {
            pass = false;
          }
        });
        card.style.display = pass ? "" : "none";
        if (pass) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? "none" : "block";
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    filters.forEach(function (select) {
      select.addEventListener("change", apply);
    });

    var params = new URLSearchParams(window.location.search);
    if (input && params.get("q")) {
      input.value = params.get("q");
      apply();
    }
  });
})();

function setupPlayer(videoId, buttonId, source) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hlsInstance = null;

  if (!video || !button || !source) {
    return;
  }

  function attachSource() {
    if (hlsInstance) {
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ maxBufferLength: 90 });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
        }
        if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
        }
      });
    } else {
      video.src = source;
    }
  }

  function play() {
    attachSource();
    button.classList.add("is-hidden");
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  }

  button.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
