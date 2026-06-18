(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-site-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var thumbs = Array.prototype.slice.call(root.querySelectorAll("[data-hero-thumb]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle("active", thumbIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var next = Number(thumb.getAttribute("data-hero-thumb")) || 0;
        show(next);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function getQueryValue(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  function setupSearch() {
    var tools = document.querySelector("[data-search-tools]");
    var grid = document.querySelector("[data-search-grid]");
    if (!tools || !grid) {
      return;
    }
    var input = tools.querySelector("[data-filter-text]");
    var category = tools.querySelector("[data-filter-category]");
    var type = tools.querySelector("[data-filter-type]");
    var reset = tools.querySelector("[data-filter-reset]");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function apply() {
      var text = normalize(input.value);
      var categoryValue = normalize(category.value);
      var typeValue = normalize(type.value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-year"),
          card.getAttribute("data-tags")
        ].join(" "));
        var matchesText = !text || haystack.indexOf(text) !== -1;
        var matchesCategory = !categoryValue || normalize(card.getAttribute("data-category")) === categoryValue;
        var matchesType = !typeValue || normalize(card.getAttribute("data-type")) === typeValue;
        card.classList.toggle("search-hidden", !(matchesText && matchesCategory && matchesType));
      });
    }

    input.value = getQueryValue("q");
    input.addEventListener("input", apply);
    category.addEventListener("change", apply);
    type.addEventListener("change", apply);
    reset.addEventListener("click", function () {
      input.value = "";
      category.value = "";
      type.value = "";
      apply();
    });
    apply();
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector("[data-play-button]");
      var source = shell.getAttribute("data-video-url");
      var hlsReady = false;

      if (!video || !source) {
        return;
      }

      function loadSource() {
        if (hlsReady) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          hlsReady = true;
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hlsReady = true;
          return;
        }
        video.src = source;
        hlsReady = true;
      }

      function playVideo() {
        loadSource();
        shell.classList.add("playing");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            shell.classList.remove("playing");
          });
        }
      }

      loadSource();
      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          playVideo();
        });
      }
      shell.addEventListener("click", function (event) {
        if (event.target === shell || event.target === button) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        shell.classList.add("playing");
      });
      video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
          shell.classList.remove("playing");
        }
      });
      video.addEventListener("ended", function () {
        shell.classList.remove("playing");
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
    setupPlayers();
  });
})();
