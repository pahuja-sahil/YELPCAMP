const images = [
  "/images/backImg1.jpg",
  "/images/backImg2.jpg",
  "/images/backImg3.jpg",
  "/images/backImg4.jpg",
  "/images/backImg5.jpeg"
];

let currentIndex = 0;
const imageElements = [];

function preloadImages() {
  const backgroundContainer = document.getElementById('background-container');
  
  // Create and preload images
  images.forEach((src, index) => {
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('background-image');
    if (index === 0) imgDiv.classList.add('active'); // Set the first image as active
    imgDiv.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${src})`;
    backgroundContainer.appendChild(imgDiv);
    imageElements.push(imgDiv);
  });
}

function changeBackgroundImage() {
  // Hide the current image
  imageElements[currentIndex].classList.remove('active');

  // Show the next image
  currentIndex = (currentIndex + 1) % images.length;
  imageElements[currentIndex].classList.add('active');
}

// Preload images and set interval for changing background
preloadImages();
setInterval(changeBackgroundImage, 5000);
