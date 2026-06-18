(function () {
    const video = document.getElementById('moviePlayer');
    const button = document.querySelector('.play-overlay');

    if (!video || !button) {
        return;
    }

    let ready = false;
    let hls = null;

    function attachStream() {
        if (ready) {
            return Promise.resolve();
        }

        const source = video.getAttribute('data-stream');
        if (!source) {
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            ready = true;
            return Promise.resolve();
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                maxBufferLength: 30,
                enableWorker: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            ready = true;
            return new Promise(function (resolve) {
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                setTimeout(resolve, 1200);
            });
        }

        video.src = source;
        ready = true;
        return Promise.resolve();
    }

    function playVideo() {
        button.classList.add('hidden');
        attachStream().then(function () {
            const attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    button.classList.remove('hidden');
                });
            }
        });
    }

    button.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('hidden');
    });
    video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
            button.classList.remove('hidden');
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
})();
