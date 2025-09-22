const playBtn = document.getElementById("playButton");

playBtn.onmouseover = () => playBtn.src = "./icons/PlayButtonHoverIcon.svg";
playBtn.onmouseleave = () => playBtn.src = "./icons/PlayButtonIcon.svg";