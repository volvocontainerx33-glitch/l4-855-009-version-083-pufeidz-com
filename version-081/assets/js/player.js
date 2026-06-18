(function () {
  window.createMoviePlayer = function (options) {
    const video = document.querySelector(options.videoSelector);
    const cover = document.querySelector(options.coverSelector);
    const button = document.querySelector(options.buttonSelector);
    let attached = false;
    let hlsInstance = null;

    if (!video || !cover || !button || !options.mediaUrl) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.mediaUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(options.mediaUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = options.mediaUrl;
      }
    }

    function start() {
      attachStream();
      cover.classList.add('hidden');
      video.controls = true;
      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          cover.classList.remove('hidden');
        });
      }
    }

    cover.addEventListener('click', start);
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      start();
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
}());
