function initMoviePlayer(sourceUrl) {
  var video = document.getElementById('movieVideo');
  var shell = document.getElementById('playerShell');
  var button = document.getElementById('playButton');
  var hlsInstance = null;
  var attached = false;

  if (!video || !shell || !button || !sourceUrl) {
    return;
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(sourceUrl);
      hlsInstance.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else {
      video.src = sourceUrl;
    }
  }

  function startPlayback() {
    attachSource();
    shell.classList.add('is-playing');

    var playResult = video.play();

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  }

  button.addEventListener('click', function (event) {
    event.preventDefault();
    startPlayback();
  });

  shell.addEventListener('click', function (event) {
    if (event.target === shell) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    shell.classList.add('is-playing');
  });

  video.addEventListener('pause', function () {
    if (!video.ended) {
      shell.classList.add('is-playing');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
