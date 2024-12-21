document.addEventListener('DOMContentLoaded', () => {
    const filePicker = document.getElementById('filePicker');
    const fileInput = document.getElementById('fileInput');
    const searchInput = document.getElementById('searchInput');
    const videoList = document.getElementById('videoList');
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const muteBtn = document.getElementById('muteBtn');

    let videoFiles = [];

    // Handle file selection
    filePicker.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        videoFiles = Array.from(event.target.files);
        displayVideoList(videoFiles);
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
                playPauseBtn.textContent = 'Pause';
            });
            videoList.appendChild(listItem);
        });
    }

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            videoPlayer.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    // Stop functionality
    stopBtn.addEventListener('click', () => {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        playPauseBtn.textContent = 'Play';
    });

    // Mute/Unmute functionality
    muteBtn.addEventListener('click', () => {
        if (videoPlayer.muted) {
            videoPlayer.muted = false;
            muteBtn.textContent = 'Mute';
        } else {
            videoPlayer.muted = true;
            muteBtn.textContent = 'Unmute';
        }
    });
});