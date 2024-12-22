document.addEventListener('DOMContentLoaded', () => {
    const filePicker = document.getElementById('filePicker');
    const fileInput = document.getElementById('fileInput');
    const searchInput = document.getElementById('searchInput');
    const videoList = document.getElementById('videoList');
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeControl = document.getElementById('volumeControl');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const subtitlePicker = document.getElementById('subtitlePicker');
    const subtitleInput = document.getElementById('subtitleInput');
    const subtitleTrack = document.getElementById('subtitleTrack');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progressBar');
    const playbackRateControl = document.getElementById('playbackRateControl');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const pipBtn = document.getElementById('pipBtn');

    let videoFiles = [];

    // Handle file selection
    filePicker.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        videoFiles = Array.from(event.target.files);
        displayVideoList(videoFiles);
    });

    // Handle subtitle file selection
    subtitlePicker.addEventListener('click', () => {
        subtitleInput.click();
    });

    subtitleInput.addEventListener('change', (event) => {
        const subtitleFile = event.target.files[0];
        if (subtitleFile) {
            const subtitleURL = URL.createObjectURL(subtitleFile);
            subtitleTrack.src = subtitleURL;
            subtitleTrack.mode = 'showing'; // Show subtitles by default
        }
    });

    // Handle search input
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredVideos = videoFiles.filter(file =>
            file.name.toLowerCase().includes(query)
        );
        displayVideoList(filteredVideos);
    });

    // Display the list of video files
    function displayVideoList(files) {
        videoList.innerHTML = '';
        files.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.addEventListener('click', () => {
                const fileURL = URL.createObjectURL(file);
                videoPlayer.src = fileURL;
                videoPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            });
            videoList.appendChild(listItem);
        });
    }

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            videoPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Stop functionality
    stopBtn.addEventListener('click', () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Mute/Unmute functionality
    muteBtn.addEventListener('click', () => {
        videoPlayer.muted = !videoPlayer.muted;
        muteBtn.innerHTML = videoPlayer.muted ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    });

    // Volume control functionality
    volumeControl.addEventListener('input', (event) => {
        videoPlayer.volume = event.target.value;
    });

    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Picture-in-Picture functionality
    pipBtn.addEventListener('click', () => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            videoPlayer.requestPictureInPicture();
        }
    });

    // Update progress bar
    videoPlayer.addEventListener('timeupdate', () => {
        const percentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progressBar.style.width = `${percentage}%`;
    });

    // Seek video
    progressContainer.addEventListener('click', (event) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percentage = (clickX / rect.width);
        videoPlayer.currentTime = percentage * videoPlayer.duration;
    });

    // Playback rate control
    playbackRateControl.addEventListener('change', (event) => {
        videoPlayer.playbackRate = event.target.value;
    });

    // Toggle dark/light theme
    toggleThemeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                playPauseBtn.click();
                break;
            case 'm':
                muteBtn.click();
                break;
            case 'f':
                fullscreenBtn.click();
                break;
            case 'p':
                pipBtn.click();
                break;
            case 'ArrowUp':
                event.preventDefault();
                volumeControl.value = Math.min(parseFloat(volumeControl.value) + 0.1, 1);
                volumeControl.dispatchEvent(new Event('input'));
                break;
            case 'ArrowDown':
                event.preventDefault();
                volumeControl.value = Math.max(parseFloat(volumeControl.value) - 0.1, 0);
                volumeControl.dispatchEvent(new Event('input'));
                break;
        }
    });
});
