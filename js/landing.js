// Change the icon of pausing and playing
$("#pauseBTN").click(function() {
  $(this).toggleClass("fa-pause");
  $(this).toggleClass("fa-play");
});

var video = document.getElementById("myVideo");
// Pause and play the video
function pause() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// Change the icon of muting and unmuting
$("#muteBTN").click(function() {
  $(this).toggleClass("fa-volume-up");
  $(this).toggleClass("fa-volume-off");
});

// Muting and unmuting the video
function mute() {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
}

// document.querySelector("source").onload = function() {background()};
function background() {
  var player = document.getElementById('myVideo');
  var mp4Vid = document.getElementById('mp4Source');

  console.log(mp4Vid);
  player.pause();

  var d = new Date().getDay();
  if (d === 1){
    mp4Vid.src = "images/landing/1.mp4";
  } else if (d === 2){
    mp4Vid.src = "images/landing/2.mp4";
  } else { // Temporarily keeping it like this until I have more videos
    mp4Vid.src = "images/landing/1.mp4";
  }

  player.load();
  player.play();
}
