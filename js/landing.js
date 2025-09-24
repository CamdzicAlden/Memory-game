const playBtn = document.getElementById("playButtonImg");

//Play button hovering
playBtn.onmouseover = () => playBtn.src = "./icons/PlayButtonHoverIcon.svg";
playBtn.onmouseleave = () => playBtn.src = "./icons/PlayButtonIcon.svg";