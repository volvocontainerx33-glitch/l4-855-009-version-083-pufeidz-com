(function () {
  var hlsLibraryUrl = window.HLS_LIBRARY_URL || 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';
  var hlsPromise = null;

  function loadHlsLibrary() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsPromise) {
      return hlsPromise;
    }

    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = hlsLibraryUrl;
      script.async = true;
      script.onload = function () {
        resolve(window.Hls || null);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsPromise;
  }

  function attachStream(video, stream) {
    if (!stream || video.dataset.ready === 'true') {
      return Promise.resolve();
    }

    video.dataset.ready = 'true';

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return Promise.resolve();
    }

    return loadHlsLibrary().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hlsInstance = hls;
      } else {
        video.src = stream;
      }
    }).catch(function () {
      video.src = stream;
    });
  }

  function startPlayer(shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('[data-play-trigger]');
    var stream = shell.getAttribute('data-stream');

    if (!video) {
      return;
    }

    attachStream(video, stream).then(function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }

      var playResult = video.play();

      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('[data-play-trigger]');

    if (cover) {
      cover.addEventListener('click', function () {
        startPlayer(shell);
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });

      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayer(shell);
        }
      });
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-page-play]')).forEach(function (button) {
    button.addEventListener('click', function () {
      var shell = document.querySelector('[data-player]');
      if (shell) {
        startPlayer(shell);
        shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
})();
