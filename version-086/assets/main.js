(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function() {
      nav.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (!slides.length || !dots.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        show(index);
        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(function() {
          show(current + 1);
        }, 5600);
      });
    });

    timer = setInterval(function() {
      show(current + 1);
    }, 5600);
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    panels.forEach(function(panel) {
      var input = panel.querySelector(".site-search");
      var chips = Array.prototype.slice.call(panel.querySelectorAll(".filter-chip"));
      var cards = Array.prototype.slice.call(panel.querySelectorAll(".movie-card"));
      var empty = panel.querySelector(".empty-tip");
      var activeType = "all";

      function apply() {
        var term = input ? input.value.trim().toLowerCase() : "";
        var visible = 0;
        cards.forEach(function(card) {
          var text = (card.getAttribute("data-tags") || "").toLowerCase();
          var type = card.getAttribute("data-type") || "";
          var matchesTerm = !term || text.indexOf(term) !== -1;
          var matchesType = activeType === "all" || type.indexOf(activeType) !== -1 || text.indexOf(activeType.toLowerCase()) !== -1;
          var show = matchesTerm && matchesType;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function(chip) {
        chip.addEventListener("click", function() {
          chips.forEach(function(item) {
            item.classList.remove("is-active");
          });
          chip.classList.add("is-active");
          activeType = chip.getAttribute("data-filter") || "all";
          apply();
        });
      });

      apply();
    });
  }

  function setupPlayer() {
    var video = document.querySelector("#moviePlayer");
    var button = document.querySelector(".play-overlay");
    if (!video || !button) {
      return;
    }
    var started = false;
    var hlsInstance = null;

    function start() {
      if (started) {
        video.play().catch(function() {});
        return;
      }
      started = true;
      var source = video.getAttribute("data-play");
      button.classList.add("hidden");
      video.setAttribute("controls", "controls");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.play().catch(function() {});
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(function() {});
        });
        return;
      }

      video.src = source;
      video.play().catch(function() {});
    }

    button.addEventListener("click", start);
    video.addEventListener("click", function() {
      if (!started) {
        start();
      }
    });

    window.addEventListener("beforeunload", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function() {
    setupNav();
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
