(function(){
  // ES modules make currentScript null, so we need a fallback
  const currentScript = document.currentScript || document.querySelector('script[src*="radio-cards.js"]');
  
  if (!currentScript || !currentScript.hasAttribute("data-radio")) {
    console.log("ℹ️ data-radio attribute not found on script tag. Skipping radio-cards init.");
    return;
  }

  // Read configuration directly from script tag attributes:
  const defaultValue = currentScript.getAttribute("data-default-value") || "";
  const selectedBg = currentScript.getAttribute("data-selected-bg");
  const selectedColor = currentScript.getAttribute("data-selected-color");

  document.addEventListener("DOMContentLoaded", () => {
    console.log("🟢 radio-cards.js loaded with attribute config!");

    const radios = document.querySelectorAll('[data-radio-input="true"]');
    console.log("🎯 Found radios:", radios.length);

    function updateSelection() {
      const wrappers = document.querySelectorAll('[data-radio-wrapper="true"]');
      wrappers.forEach((label) => label.classList.remove("selected"));

      radios.forEach((radio) => {
        const wrapper = radio.closest('[data-radio-wrapper="true"]');
        if (radio.checked && wrapper) {
          wrapper.classList.add("selected");
          if (selectedBg) {
            wrapper.style.backgroundColor = selectedBg;
          }
          if (selectedColor) {
            wrapper.style.color = selectedColor;
            wrapper.querySelectorAll("*").forEach(el => el.style.color = selectedColor);
          }
          console.log("✅ ADDED .selected to", wrapper);
        }
      });
    }

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        console.log("📻 Radio changed:", radio);
        updateSelection();
      });
    });

    if (defaultValue) {
      radios.forEach((radio) => {
        if (radio.getAttribute("data-radio-value") === defaultValue) {
          radio.checked = true;
          radio.dispatchEvent(new Event("change", { bubbles: true }));
          console.log("⭐ Default radio set active by data-radio-value:", radio);
        }
      });
    }

    updateSelection();
  });
})();
