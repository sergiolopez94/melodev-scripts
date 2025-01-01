function resizeIframeByAttributes() {
    // Select all iframes with the attribute
    const iframes = document.querySelectorAll('[data-video-iframe]');
  
    iframes.forEach(iframe => {
      const container = iframe.parentElement; // Assume parent is the container
      if (!container) return; // Skip if no parent container
  
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
  
      // Center the iframe
      iframe.style.position = 'absolute';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.transform = 'translate(-50%, -50%)';
      iframe.style.border = 'none';
    });
  }
  
  // Resize on load and window resize
  window.addEventListener('load', resizeIframeByAttributes);
  window.addEventListener('resize', resizeIframeByAttributes);
  