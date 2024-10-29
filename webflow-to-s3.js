    document.addEventListener('DOMContentLoaded', function() {
        console.log("JavaScript loaded and ready.");

        // Select the Webflow form using the specific ID
        const form = document.querySelector('#wf-form-Sorteo-Black-Friday');

        // Ensure the form exists before attaching the event listener
        if (!form) {
            console.error('Form with ID "wf-form-Sorteo-Black-Friday" not found.');
            return;
        }
        console.log("Form found:", form);

        // Intercept form submission
        form.addEventListener('submit', async function(event) {
            event.preventDefault();  // Prevent Webflow's default form submission
            console.log("Form submission intercepted.");

            // Get form fields
            const nameInput = document.querySelector('#Name');
            const emailInput = document.querySelector('#email');
            const fileInput = document.querySelector('#file-upload');

            // Check if each field exists before accessing its value
            if (!nameInput) {
                console.error('Name input field not found.');
                return;
            }
            if (!emailInput) {
                console.error('Email input field not found.');
                return;
            }
            if (!fileInput) {
                console.error('File upload input field not found.');
                return;
            }
            console.log("All input fields found.");

            const name = nameInput.value;
            const email = emailInput.value;
            const file = fileInput.files[0];

            if (!file) {
                alert('Please upload a file.');
                console.error('No file uploaded.');
                return;
            }
            console.log("File found:", file);

            // Generate a unique filename using UUID
            function generateUUID() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = (Math.random() * 16) | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            // Create unique filename with the original file extension
            const fileExtension = file.name.split('.').pop();
            const uniqueFilename = `${generateUUID()}.${fileExtension}`;
            console.log("Generated unique filename:", uniqueFilename);

            // Prepare the form data for the request
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('file', file, uniqueFilename);  // Attach file with new unique filename
            console.log("Form data prepared:", formData);

            // Send the form data to your n8n webhook
            try {
                const response = await fetch('https://sergiolopez94.app.n8n.cloud/webhook-test/bf-pueblo-upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
                    console.log("Form submitted successfully:", response);
                } else {
                    console.error('Failed to submit form:', response.statusText);
                    alert('Failed to submit form. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again.');
            }
        });
    });