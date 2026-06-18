(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var cover = player.querySelector(".player-cover");
      var button = player.querySelector(".play-overlay");
      var source = player.getAttribute("data-video");
      var initialized = false;
      var hlsInstance = null;

      function initialize() {
        if (initialized || !video || !source) {
          return;
        }

        initialized = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        }
      }

      function startPlayback() {
        initialize();
        player.classList.add("is-playing");

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {
            player.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          startPlayback();
        });
      }

      if (cover) {
        cover.addEventListener("click", function () {
          startPlayback();
        });
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            startPlayback();
          }
        });
      }

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
})();
