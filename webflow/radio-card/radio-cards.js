(function(){
  try {
    // ES modules make currentScript null, so we need a fallback
    const currentScript = document.currentScript;
    const fallbackScript = document.querySelector('script[src*="radio-cards.js"]');
    const scriptTag = currentScript || fallbackScript;
    
    if (!scriptTag) {
      console.error("❌ Radio-cards: No script tag found!");
      return;
    }
    
    if (!scriptTag.hasAttribute("data-radio")) {
      console.log("ℹ️ Radio-cards: data-radio attribute not found on script tag. Skipping init.");
      return;
    }

  // Read configuration directly from script tag attributes:
  const defaultValue = scriptTag.getAttribute("data-default-value") || "";
  const selectedBg = scriptTag.getAttribute("data-selected-bg");
  const selectedColor = scriptTag.getAttribute("data-selected-color");

  function initRadioCards() {
    console.log("🟢 Radio-cards initialized!");

    const radios = document.querySelectorAll('[data-radio-input="true"]');
    console.log("🎯 Radio-cards: Found", radios.length, "radio inputs");
    
    // Hide radio inputs with display: none
    radios.forEach((radio) => {
      radio.style.display = 'none';
    });

    function updateSelection() {
      // Process each radio individually
      radios.forEach((radio) => {
        const wrapper = radio.closest('[data-radio-wrapper="true"]');
        if (!wrapper) return;
        
        if (radio.checked) {
          // Add selected class and styling to checked radio
          wrapper.classList.add("selected");
          if (selectedBg) {
            wrapper.style.backgroundColor = selectedBg;
          }
          if (selectedColor) {
            wrapper.style.color = selectedColor;
            wrapper.querySelectorAll("*").forEach(el => el.style.color = selectedColor);
          }
        } else {
          // Remove selected class and clear styling from unchecked radio
          wrapper.classList.remove("selected");
          if (selectedBg) {
            wrapper.style.backgroundColor = "";
          }
          if (selectedColor) {
            wrapper.style.color = "";
            wrapper.querySelectorAll("*").forEach(el => el.style.color = "");
          }
        }
      });
    }

    radios.forEach((radio) => {
      radio.addEventListener("change", updateSelection);
    });

    if (defaultValue) {
      radios.forEach((radio) => {
        if (radio.getAttribute("data-radio-value") === defaultValue) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
        }
      });
    }

    updateSelection();
  }

  // Check if DOM is already ready or wait for it
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initRadioCards);
  } else {
    initRadioCards();
  }
  
  } catch (error) {
    console.error("❌ Radio-cards error:", error);
  }
})();
