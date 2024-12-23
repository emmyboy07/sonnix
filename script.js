document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoList = document.getElementById('videoList');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeControl = document.getElementById('volumeControl');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pipBtn = document.getElementById('pipBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const playbackRateControl = document.getElementById('playbackRateControl');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const progressBar = document.getElementById('progressBar');
    const bookmarkList = document.getElementById('bookmarkList');
    const searchInput = document.getElementById('searchInput');
    const filePicker = document.getElementById('filePicker');
    const fileInput = document.getElementById('fileInput');
    const toggleTheme = document.getElementById('toggleTheme');
    const subtitleBtn = document.getElementById('subtitleBtn');
    const subtitleInput = document.getElementById('subtitleInput');
    const subtitleTrack = document.getElementById('subtitleTrack');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const backBtn = document.getElementById('backBtn');
    const autoSearchBtn = document.getElementById('autoSearchBtn');
  
    let playlist = [];
    let currentVideoIndex = 0;
    let isShuffled = false;
    let isRepeating = false;
  
    // Load saved settings
    loadSettings();
  
    // File selection
    filePicker.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelection);
  
    function handleFileSelection(event) {
      const files = event.target.files;
      playlist = Array.from(files).filter(file => file.type.startsWith('video/'));
      updatePlaylist();
      if (playlist.length > 0) {
        loadVideo(0);
      }
    }
  
    function updatePlaylist() {
      videoList.innerHTML = '';
      playlist.forEach((video, index) => {
        const li = document.createElement('li');
        li.textContent = video.name;
        li.addEventListener('click', () => loadVideo(index));
        videoList.appendChild(li);
      });
    }
  
    function loadVideo(index) {
      if (index >= 0 && index < playlist.length) {
        currentVideoIndex = index;
        const videoURL = URL.createObjectURL(playlist[index]);
        videoPlayer.src = videoURL;
        videoPlayer.play().catch(error => {
          console.error('Error playing video:', error);
          alert('Error playing video. Please try another file.');
        });
      }
    }
  
    // Playback controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    stopBtn.addEventListener('click', stopVideo);
    prevBtn.addEventListener('click', playPreviousVideo);
    nextBtn.addEventListener('click', playNextVideo);
    muteBtn.addEventListener('click', toggleMute);
    volumeControl.addEventListener('input', changeVolume);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    pipBtn.addEventListener('click', togglePictureInPicture);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    playbackRateControl.addEventListener('change', changePlaybackRate);
    bookmarkBtn.addEventListener('click', addBookmark);
  
    function togglePlayPause() {
      if (videoPlayer.paused) {
        videoPlayer.play().catch(error => {
          console.error('Error playing video:', error);
          alert('Error playing video. Please try another file.');
        });
      } else {
        videoPlayer.pause();
      }
      updatePlayPauseButton();
    }
  
    function updatePlayPauseButton() {
      playPauseBtn.innerHTML = videoPlayer.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    }
  
    function stopVideo() {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
      updatePlayPauseButton();
    }
  
    function playPreviousVideo() {
      loadVideo(isShuffled ? Math.floor(Math.random() * playlist.length) : (currentVideoIndex - 1 + playlist.length) % playlist.length);
    }
  
    function playNextVideo() {
      loadVideo(isShuffled ? Math.floor(Math.random() * playlist.length) : (currentVideoIndex + 1) % playlist.length);
    }
  
    function toggleMute() {
      videoPlayer.muted = !videoPlayer.muted;
      muteBtn.innerHTML = videoPlayer.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
      saveSettings();
    }
  
    function changeVolume() {
      videoPlayer.volume = volumeControl.value;
      videoPlayer.muted = false;
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      saveSettings();
    }
  
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen().catch(error => {
          console.error('Error attempting to enable fullscreen:', error);
          alert('Unable to enter fullscreen mode. Please check your browser settings.');
        });
      } else {
        document.exitFullscreen();
      }
    }
  
    function togglePictureInPicture() {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(error => {
          console.error('Error exiting Picture-in-Picture mode:', error);
          alert('Unable to exit Picture-in-Picture mode. Please try again.');
        });
      } else {
        videoPlayer.requestPictureInPicture().catch(error => {
          console.error('Error entering Picture-in-Picture mode:', error);
          alert('Unable to enter Picture-in-Picture mode. This feature may not be supported in your browser.');
        });
      }
    }
  
    function toggleShuffle() {
      isShuffled = !isShuffled;
      shuffleBtn.classList.toggle('active');
      saveSettings();
    }
  
    function toggleRepeat() {
      isRepeating = !isRepeating;
      repeatBtn.classList.toggle('active');
      saveSettings();
    }
  
    function changePlaybackRate() {
      videoPlayer.playbackRate = parseFloat(playbackRateControl.value);
    }
  
    // Progress bar
    videoPlayer.addEventListener('timeupdate', updateProgressBar);
    progressBar.parentElement.addEventListener('click', seekVideo);
  
    function updateProgressBar() {
      const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
      progressBar.style.width = `${progress}%`;
    }
  
    function seekVideo(event) {
      const seekTime = (event.offsetX / progressBar.parentElement.offsetWidth) * videoPlayer.duration;
      videoPlayer.currentTime = seekTime;
    }
  
    // Bookmarks
    function addBookmark() {
      const bookmark = {
        time: videoPlayer.currentTime,
        text: `Bookmark at ${formatTime(videoPlayer.currentTime)}`
      };
      const li = createBookmarkElement(bookmark);
      bookmarkList.appendChild(li);
      saveSettings();
    }
  
    function createBookmarkElement(bookmark) {
      const li = document.createElement('li');
      li.textContent = bookmark.text;
      li.addEventListener('click', () => {
        videoPlayer.currentTime = bookmark.time;
      });
      const removeBtn = document.createElement('span');
      removeBtn.textContent = '×';
      removeBtn.classList.add('remove-bookmark');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        bookmarkList.removeChild(li);
        saveSettings();
      });
      li.appendChild(removeBtn);
      return li;
    }
  
    function formatTime(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  
    // Search functionality
    searchInput.addEventListener('input', searchVideos);
  
    function searchVideos() {
      const searchTerm = searchInput.value.toLowerCase();
      Array.from(videoList.children).forEach(item => {
        const videoName = item.textContent.toLowerCase();
        item.style.display = videoName.includes(searchTerm) ? '' : 'none';
      });
    }
  
    // Theme toggle
    toggleTheme.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('light-theme');
      saveSettings();
    });
  
    // Subtitle support
    subtitleBtn.addEventListener('click', () => subtitleInput.click());
    subtitleInput.addEventListener('change', handleSubtitleSelection);
  
    function handleSubtitleSelection(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          subtitleTrack.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    // Error handling for video playback
    videoPlayer.addEventListener('error', (e) => {
      console.error('Video error:', videoPlayer.error);
      alert(`Error playing video: ${videoPlayer.error.message}`);
    });
  
    // Auto-play next video
    videoPlayer.addEventListener('ended', () => {
      if (isRepeating) {
        videoPlayer.play().catch(error => {
          console.error('Error replaying video:', error);
          alert('Error replaying video. Please try another file.');
        });
      } else {
        playNextVideo();
      }
    });
  
    // Memory functions
    function saveSettings() {
      const settings = {
        volume: videoPlayer.volume,
        muted: videoPlayer.muted,
        isShuffled,
        isRepeating,
        theme: document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme',
        bookmarks: Array.from(bookmarkList.children).map(li => ({
          time: parseFloat(li.querySelector('.remove-bookmark').getAttribute('data-time')),
          text: li.textContent
        }))
      };
      localStorage.setItem('videoPlayerSettings', JSON.stringify(settings));
    }
  
    function loadSettings() {
      const settings = JSON.parse(localStorage.getItem('videoPlayerSettings'));
      if (settings) {
        videoPlayer.volume = settings.volume;
        videoPlayer.muted = settings.muted;
        isShuffled = settings.isShuffled;
        isRepeating = settings.isRepeating;
        document.body.classList.add(settings.theme);
        settings.bookmarks.forEach(bookmark => {
          const li = createBookmarkElement(bookmark);
          bookmarkList.appendChild(li);
        });
      }
    }
  
    // Hamburger menu functionality
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      updateBackButtonVisibility();
    });
  
    backBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  
    function updateBackButtonVisibility() {
      if (window.innerWidth <= 768) {
        backBtn.style.display = 'block';
      } else {
        backBtn.style.display = 'none';
        sidebar.classList.remove('open');  // Ensure sidebar is closed on larger screens
      }
    }
  
    window.addEventListener('resize', updateBackButtonVisibility);
  
    // Auto-search functionality
    autoSearchBtn.addEventListener('click', () => {
      const searchTerm = prompt('Enter a search term for videos:');
      if (searchTerm) {
        searchVideosOnline(searchTerm);
      }
    });
  
    async function searchVideosOnline(searchTerm) {
      try {
        const response = await fetch(`https://api.example.com/videos?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        // Clear existing playlist
        playlist = [];
        updatePlaylist();
  
        // Add found videos to playlist
        data.videos.forEach(video => {
          playlist.push({
            name: video.title,
            url: video.url
          });
        });
  
        updatePlaylist();
        if (playlist.length > 0) {
          loadVideo(0);
        } else {
          alert('No videos found for the given search term.');
        }
      } catch (error) {
        console.error('Error searching for videos:', error);
        alert('An error occurred while searching for videos. Please try again later.');
      }
    }
  
    // Initialize
    updateBackButtonVisibility();
    console.log('Smart Video Player initialized successfully.');
  });
  
  