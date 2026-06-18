function initMoviePlayer(url) {
  var video = document.getElementById('moviePlayer');
  var layer = document.querySelector('.play-layer');
  var trigger = document.querySelector('.play-trigger');
  var hlsInstance = null;

  if (!video || !url) {
    return;
  }

  function hideLayer() {
    if (layer) {
      layer.classList.add('is-hidden');
    }
  }

  function showLayer() {
    if (layer) {
      layer.classList.remove('is-hidden');
    }
  }

  function attach() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = url;
      }
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsInstance) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      }
      return Promise.resolve();
    }
    if (!video.src) {
      video.src = url;
    }
    return Promise.resolve();
  }

  function play() {
    hideLayer();
    attach().then(function () {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          showLayer();
        });
      }
    });
  }

  if (trigger) {
    trigger.addEventListener('click', play);
  }
  if (layer) {
    layer.addEventListener('click', play);
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
}
