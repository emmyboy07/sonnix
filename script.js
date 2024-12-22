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
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const bookmarkList = document.getElementById('bookmarkList');
    const savePlaylistBtn = document.getElementById('savePlaylistBtn');
    const loadPlaylistBtn = document.getElementById('loadPlaylistBtn');
    const themeSelect = document.getElementById('themeSelect');

    let videoFiles = [];

    // Handle file selection
    filePicker.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        videoFiles = Array.from(event.target.files);
        displayVideoList(videoFiles);
        saveToLocalStorage('videoFiles', videoFiles.map(file => file.name));
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
    async function displayVideoList(files) {
        videoList.innerHTML = '';
        for (const file of files) {
            const listItem = document.createElement('li');
            const thumbnail = await generateThumbnail(file);
            listItem.innerHTML = `<img src="${thumbnail}" alt="Thumbnail"> ${file.name}`;
            listItem.addEventListener('click', () => {
                const fileURL = URL.createObjectURL(file);
                videoPlayer.src = fileURL;
                videoPlayer.play().catch(error => console.error('Error playing video:', error));
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                saveToLocalStorage('currentVideo', file.name);
                loadBookmarks();
            });
            videoList.appendChild(listItem);
        }
    }

    // Generate thumbnail for video
    function generateThumbnail(videoFile) {
        return new Promise((resolve) => {
            const thumbnailCanvas = document.createElement('canvas');
            const thumbnailContext = thumbnailCanvas.getContext('2d');
            const videoElement = document.createElement('video');

            videoElement.src = URL.createObjectURL(videoFile);
            videoElement.addEventListener('loadeddata', () => {
                thumbnailCanvas.width = videoElement.videoWidth / 10;
                thumbnailCanvas.height = videoElement.videoHeight / 10;
                thumbnailContext.drawImage(videoElement, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
                resolve(thumbnailCanvas.toDataURL());
            });
        });
    }

    // Save to LocalStorage
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Get from LocalStorage
    function getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    // Load playback history
    function loadPlaybackHistory() {
        const currentVideo = getFromLocalStorage('currentVideo');
        const playbackHistory = getFromLocalStorage('playbackHistory') || {};
        if (currentVideo && playbackHistory[currentVideo]) {
            videoPlayer.currentTime = playbackHistory[currentVideo];
        }
    }

    // Save playback history
    videoPlayer.addEventListener('timeupdate', () => {
        const currentVideo = getFromLocalStorage('currentVideo');
        if (currentVideo) {
            const playbackHistory = getFromLocalStorage('playbackHistory') || {};
            playbackHistory[currentVideo] = videoPlayer.currentTime;
            saveToLocalStorage('playbackHistory', playbackHistory);
        }
    });

    // Load bookmarks for the current video
    function loadBookmarks() {
        const currentVideo = getFromLocalStorage('currentVideo');
        const bookmarks = getFromLocalStorage('bookmarks') || {};
        if (currentVideo && bookmarks[currentVideo]) {
            displayBookmarks(bookmarks[currentVideo]);
        }
    }

    // Display bookmarks
    function displayBookmarks(bookmarks) {
        bookmarkList.innerHTML = '';
        bookmarks.forEach((time, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `Bookmark ${index + 1}: ${formatTime(time)}`;
            listItem.addEventListener('click', () => {
                videoPlayer.currentTime = time;
                videoPlayer.play().catch(error => console.error('Error playing video:', error));
            });
            bookmarkList.appendChild(listItem);
        });
    }

    // Add bookmark
    bookmarkBtn.addEventListener('click', () => {
        const currentVideo = getFromLocalStorage('currentVideo');
        if (currentVideo) {
            const bookmarks = getFromLocalStorage('bookmarks') || {};
            if (!bookmarks[currentVideo]) bookmarks[currentVideo] = [];
            bookmarks[currentVideo].push(videoPlayer.currentTime);
            saveToLocalStorage('bookmarks', bookmarks);
            displayBookmarks(bookmarks[currentVideo]);
        }
    });

    // Format time for display
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Save playlist
    savePlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName) {
            saveToLocalStorage(`playlist_${playlistName}`, videoFiles.map(file => file.name));
        }
    });

    // Load playlist
    loadPlaylistBtn.addEventListener('click', () => {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName) {
            const savedFiles = getFromLocalStorage(`playlist_${playlistName}`);
            if (savedFiles) {
                videoFiles = savedFiles.map(fileName => new File([], fileName));
                displayVideoList(videoFiles);
            } else {
                alert('Playlist not found!');
            }
        }
    });

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play().catch(error => console.error('Error playing video:', error));
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
            videoPlayer.requestFullscreen().catch(error => console.error('Error entering fullscreen:', error));
        } else {
            document.exitFullscreen().catch(error => console.error('Error exiting fullscreen:', error));
        }
    });

    // Picture-in-Picture functionality
    pipBtn.addEventListener('click', () => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(error => console.error('Error exiting PiP:', error));
        } else {
            videoPlayer.requestPictureInPicture().catch(error => console.error('Error entering PiP:', error));
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
        saveToLocalStorage('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
    });

    // Load theme from local storage
    function loadTheme() {
        const savedTheme = getFromLocalStorage('theme');
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
    }

    themeSelect.addEventListener('change', (event) => {
        document.body.className = '';
        document.body.classList.add(event.target.value);
        saveToLocalStorage('theme', event.target.value);
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

    // Load initial data
    loadPlaybackHistory();
    loadBookmarks();
    loadTheme();

    // Load video list from local storage
    function loadVideoListFromLocalStorage() {
        const savedFiles = getFromLocalStorage('videoFiles');
        if (savedFiles) {
            videoFiles = savedFiles.map(fileName => new File([], fileName));
            displayVideoList(videoFiles);
        }
    }

    // Load current video
    function loadCurrentVideo() {
        const currentVideo = getFromLocalStorage('currentVideo');
        if (currentVideo) {
            const videoFile = videoFiles.find(file => file.name === currentVideo);
            if (videoFile) {
                const fileURL = URL.createObjectURL(videoFile);
                videoPlayer.src = fileURL;
                videoPlayer.play().catch(error => console.error('Error playing video:', error));
            }
        }
    }

    loadVideoListFromLocalStorage();
    loadCurrentVideo();
});