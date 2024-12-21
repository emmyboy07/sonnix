const video = document.getElementById('video');
const playPauseBtn = document.getElementById('play-pause');
const seekBar = document.getElementById('seek-bar');
const muteBtn = document.getElementById('mute');
const volumeSlider = document.getElementById('volume-slider');
const fullscreenBtn = document.getElementById('fullscreen');
const filePickerButton = document.getElementById('file-picker-button');
const filePicker = document.getElementById('file-picker');

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = 'Pause';
  } else {
    video.pause();
    playPauseBtn.textContent = 'Play';
  }
});

// Update seek bar as video plays
video.addEventListener('timeupdate', () => {
  seekBar.value = (video.currentTime / video.duration) * 100;
});

// Seek functionality
seekBar.addEventListener('input', () => {
  video.currentTime = (seekBar.value / 100) * video.duration;
});

// Mute/Unmute functionality
muteBtn.addEventListener('click', () => {
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
});

// Volume control
volumeSlider.addEventListener('input', () => {
  video.volume = volumeSlider.value;
});

// Fullscreen functionality
fullscreenBtn.addEventListener('click', () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  }
});

// File picker functionality
filePickerButton.addEventListener('click', () => {
  filePicker.click();
});

filePicker.addEventListener('change', (event) => {
  const files = event.target.files;
  if (files.length > 0) {
    const fileURL = URL.createObjectURL(files[0]);
    video.src = fileURL;
    video.load();
    video.play();
    playPauseBtn.textContent = 'Pause';
  }
});
`;

export { htmlContent, cssContent, jsContent };
