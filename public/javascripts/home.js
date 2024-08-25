const images = [
  "/images/backImg1.jpg",
  "/images/backImg2.jpg",
  "/images/backImg3.jpg",
  "/images/backImg4.jpg",
  "/images/backImg5.jpeg"
];

let currentIndex = 0;

function changeBackgroundImage() {
  currentIndex = (currentIndex + 1) % images.length;
  document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${images[currentIndex]})`;
}

// Change background image every 5 seconds
setInterval(changeBackgroundImage, 5000);
