    document.addEventListener('DOMContentLoaded', function() {
        console.log("JavaScript loaded and ready.");

        // Select the Webflow form using the specific ID
        const form = document.querySelector('#wf-form-Sorteo-Black-Friday');

        if (!form) {
            console.error('Form with ID "wf-form-Sorteo-Black-Friday" not found.');
            return;
        }
        console.log("Form found:", form);

        // Intercept form submission
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("Form submission intercepted.");

            // Get form fields
            const nameInput = document.querySelector('#Name');
            const lastInput = document.querySelector('#Last');
            const ageInput = document.querySelector('#Age');
            const emailInput = document.querySelector('#email');
            const phoneInput = document.querySelector('#phone');
            const cityInput = document.querySelector('#city');
            const fileInput = document.querySelector('#file');

            if (!nameInput || !lastInput || !ageInput || !emailInput || !phoneInput || !cityInput || !fileInput) {
                console.error('One or more form fields not found.');
                return;
            }
            console.log("All input fields found.");

            const name = nameInput.value;
            const last = lastInput.value;
            const age = ageInput.value;
            const email = emailInput.value;
            const phone = phoneInput.value;
            const city = cityInput.value;
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

            const fileExtension = file.name.split('.').pop();
            const uniqueFilename = `${generateUUID()}.${fileExtension}`;
            console.log("Generated unique filename:", uniqueFilename);

            // Prepare the form data with the UUID filename only
            const formData = new FormData();
            formData.append('name', name);
            formData.append('last', last);
            formData.append('age', age);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('city', city);
            formData.append('file', new File([file], uniqueFilename));  // Use UUID filename only
            console.log("Form data prepared with UUID filename:", formData);

            try {
                const response = await fetch('https://n8n.melodev.com/webhook-test/bf-pueblo-upload', {
                    method: 'POST',
                    body: formData,
                });

                console.log("Response received from webhook:", response);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Parsed JSON response data:", data);

                    // Check if redirectUrl is present in response and redirect
                    if (data.redirectUrl) {
                        console.log("Redirecting to:", data.redirectUrl);
                        window.location.href = data.redirectUrl;
                    } else {
                        console.error("No redirectUrl found in response:", data);
                    }
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