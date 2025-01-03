function resizeVideoBackgroundElements() {
  // Select and resize video iframe
  const iframes = document.querySelectorAll('[video-bg-iframe]');
  iframes.forEach(iframe => resizeElement(iframe));

  // Select and resize fallback images
  const images = document.querySelectorAll('[video-bg-image]');
  images.forEach(image => resizeElement(image));
}

function resizeElement(element) {
  const container = element.parentElement; // Assume parent is the container
  if (!container) return; // Skip if no parent container

  // Get container dimensions
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Get container aspect ratio
  const containerAspectRatio = containerWidth / containerHeight;

  // Aspect ratio of the video/image (16:9 in this case)
  const contentAspectRatio = 16 / 9;

  // Adjust element dimensions
  if (containerAspectRatio > contentAspectRatio) {
    // Container is wider than content
    element.style.width = `${containerWidth}px`;
    element.style.height = `${containerWidth / contentAspectRatio}px`;
  } else {
    // Container is taller than content
    element.style.width = `${containerHeight * contentAspectRatio}px`;
    element.style.height = `${containerHeight}px`;
  }

  // Center the element
  element.style.position = 'absolute';
  element.style.top = '50%';
  element.style.left = '50%';
  element.style.transform = 'translate(-50%, -50%)';
}

// Resize on load and window resize
window.addEventListener('load', resizeVideoBackgroundElements);
window.addEventListener('resize', resizeVideoBackgroundElements);
