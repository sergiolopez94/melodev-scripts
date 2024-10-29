document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded and ready.");

    // Log all forms and containers related to the form
    console.log("Logging all forms on the page:");
    document.querySelectorAll("form").forEach((f, index) => {
      console.log(`Form ${index + 1}:`, f);
    });

    console.log("Logging all elements with class .sorteo_form-wrapper:");
    document.querySelectorAll(".sorteo_form-wrapper").forEach((el, index) => {
      console.log(`.sorteo_form-wrapper element ${index + 1}:`, el);
    });

    // Use a more general form selector to check if any form is found
    const form = document.querySelector("form");
    if (form) {
      console.log("Form found:", form);

      form.addEventListener("submit", async function(event) {
        event.preventDefault();
        console.log("Form submission prevented.");

        // Proceed with the rest of the code if form is found
        const formData = new FormData(form);
        console.log("Form data collected:", formData);
        
        // Check for file input
        const fileInput = form.querySelector(".file-upload");
        if (fileInput && fileInput.files.length > 0) {
          console.log("File input found with file:", fileInput.files[0]);
          const fileData = new FormData();
          fileData.append("file", fileInput.files[0]);

          // Additional code for file upload and form submission...
        } else {
          console.log("No file input found or no file selected.");
        }
      });
    } else {
      console.error("No form found on the page.");
    }
  });