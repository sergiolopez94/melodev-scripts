function resizeIframe() {
    const container = document.querySelector('.hero-bg-video-container');
    const iframe = document.getElementById('videoIframe');
  
    // Get container dimensions
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
  
    // Get container aspect ratio
    const containerAspectRatio = containerWidth / containerHeight;
  
    // Aspect ratio of the video (16:9 in this case)
    const videoAspectRatio = 16 / 9;
  
    // Adjust iframe dimensions
    if (containerAspectRatio > videoAspectRatio) {
      // Container is wider than video
      iframe.style.width = `${containerWidth}px`;
      iframe.style.height = `${containerWidth / videoAspectRatio}px`;
    } else {
      // Container is taller than video
      iframe.style.width = `${containerHeight * videoAspectRatio}px`;
      iframe.style.height = `${containerHeight}px`;
    }
  }
  
  // Resize on load and window resize
  window.addEventListener('load', resizeIframe);
  window.addEventListener('resize', resizeIframe);
  