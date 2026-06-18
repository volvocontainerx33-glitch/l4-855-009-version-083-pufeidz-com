(function () {
    function updateStatus(shell, message) {
        var status = shell.querySelector('[data-player-status]');
        if (status) {
            status.textContent = message;
        }
    }

    function initializePlayer(shell) {
        var video = shell.querySelector('video');
        var source = shell.getAttribute('data-video');
        var poster = shell.getAttribute('data-poster');

        if (!video || !source) {
            updateStatus(shell, '未找到可用播放源');
            return;
        }

        if (poster) {
            video.setAttribute('poster', poster);
        }

        updateStatus(shell, '正在加载播放源...');

        if (window.Hls && window.Hls.isSupported()) {
            if (shell._hlsInstance) {
                shell._hlsInstance.destroy();
            }
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            shell._hlsInstance = hls;
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                shell.classList.add('is-playing');
                updateStatus(shell, '播放源已就绪');
                video.play().catch(function () {
                    updateStatus(shell, '播放源已就绪，请再次点击播放');
                });
            });
            hls.on(window.Hls.Events.ERROR, function (_, data) {
                if (data && data.fatal) {
                    updateStatus(shell, '播放加载异常，请刷新页面重试');
                }
            });
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', function () {
                shell.classList.add('is-playing');
                updateStatus(shell, '播放源已就绪');
                video.play().catch(function () {
                    updateStatus(shell, '播放源已就绪，请再次点击播放');
                });
            }, { once: true });
            return;
        }

        updateStatus(shell, '当前浏览器不支持 HLS 播放，请更换现代浏览器');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var players = document.querySelectorAll('.js-video-player');
        players.forEach(function (shell) {
            var button = shell.querySelector('.player-start');
            if (!button) {
                return;
            }
            button.addEventListener('click', function () {
                initializePlayer(shell);
            });
        });
    });
})();
