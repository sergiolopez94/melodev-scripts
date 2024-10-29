  document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded and ready.");

    const interval = setInterval(function() {
      // Target the form within the nested structure
      const form = document.querySelector(".sorteo_form-wrapper .sorteo_form form");
      console.log("Form selector executed, form found:", form);

      if (form) {
        clearInterval(interval); // Stop checking once the form is found
        console.log("Form found:", form);

        form.addEventListener("submit", async function(event) {
          event.preventDefault(); // Prevent default form submission
          console.log("Form submission prevented.");

          const formData = new FormData(form); // Collect form data
          console.log("Form data collected:", formData);

          // Target the file input within the form
          const fileInput = form.querySelector(".file-upload");
          if (fileInput && fileInput.files.length > 0) {
            console.log("File input found with file:", fileInput.files[0]);

            const fileData = new FormData();
            fileData.append("file", fileInput.files[0]);

            try {
              // Send file to the file upload webhook
              const fileUploadResponse = await fetch("https://n8n.melodev.com/webhook-test/bf-pueblo-upload", {
                method: "POST",
                body: fileData
              });

              console.log("File upload response received:", fileUploadResponse);

              if (fileUploadResponse.ok) {
                const responseJson = await fileUploadResponse.json();
                console.log("File upload response JSON:", responseJson);

                // Extract the file URL from the response
                const fileUrl = responseJson[0].fileUrl; // Adjust if necessary
                console.log("Extracted file URL:", fileUrl);

                // Append the file URL to formData for final submission
                formData.append("fileUrl", fileUrl);
              } else {
                alert("File upload failed.");
                console.error("File upload failed with status:", fileUploadResponse.status);
                return;
              }
            } catch (error) {
              console.error("Error during file upload:", error);
              alert("File upload encountered an error.");
              return;
            }
          } else {
            console.log("No file to upload.");
          }

          // Submit the form data (including file URL) to the final webhook
          try {
            const formSubmitResponse = await fetch("https://n8n.melodev.com/webhook-test/bf-pueblo-submit", {
              method: "POST",
              body: formData
            });
            console.log("Form submission response:", formSubmitResponse);

            if (formSubmitResponse.ok) {
              alert("Form submitted successfully!");
              form.reset(); // Optionally reset the form
            } else {
              alert("Form submission failed.");
              console.error("Form submission failed with status:", formSubmitResponse.status);
            }
          } catch (error) {
            console.error("Error during form submission:", error);
            alert("Error submitting the form.");
          }
        });
      } else {
        console.log("Form not yet loaded, retrying...");
      }
    }, 500); // Check every 500 milliseconds
  });
