document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript loaded and ready.");

    // Add CSS for the spinner dynamically
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            display: inline-flex;
            width: 12px;
            height: 12px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px; /* Space between text and spinner */
            vertical-align: middle;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Select the Webflow form using the specific ID
    const form = document.querySelector('#wf-form-Sorteo-Black-Friday');

    if (!form) {
        console.error('Form with ID "wf-form-Sorteo-Black-Friday" not found.');
        return;
    }
    console.log("Form found:", form);

    // Select the submit button using the custom attribute for input[type="submit"]
    const submitButton = form.querySelector('input[type="submit"][melodev="bt-submit"]');
    
    if (!submitButton) {
        console.error('Submit button with custom attribute melodev="bt-submit" not found.');
        return;
    }
    console.log('Submit button found:', submitButton);

    // Intercept form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        console.log("Form submission intercepted.");

        // Disable the button and change the value to 'Submitting...'
        submitButton.value = "Submitting...";
        submitButton.disabled = true;

        // Display the spinner inline next to the text
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        submitButton.parentNode.insertBefore(spinner, submitButton.nextSibling);

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
            submitButton.value = "Someter";  // Revert button text if there's an error
            submitButton.disabled = false;
            if (spinner) spinner.remove();
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
            submitButton.value = "Someter";  // Revert button text if there's an error
            submitButton.disabled = false;
            if (spinner) spinner.remove();
            return;
        }
        console.log("File found:", file);

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

        // Prepare the form data for the request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('last', last);
        formData.append('age', age);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('city', city);
        formData.append('file', file, uniqueFilename);
        formData.append('filename', uniqueFilename);
        console.log("Form data prepared:", formData);

        try {
            const response = await fetch('https://n8n.melodev.com/webhook/bf-pueblo-upload', {
                method: 'POST',
                body: formData,
            });

            console.log("Response received from webhook:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Parsed JSON response data:", data);

                if (data.redirectUrl) {
                    console.log("Redirecting to:", data.redirectUrl);
                    window.location.href = data.redirectUrl;
                } else {
                    console.error("No redirectUrl found in response:", data);
                }
            } else {
                console.error('Failed to submit form:', response.statusText);
                alert('Failed to submit form. Please try again.');
                submitButton.value = "Someter";  // Revert button text on failure
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
            submitButton.value = "Someter";  // Revert button text on error
            submitButton.disabled = false;
        } finally {
            if (spinner) spinner.remove();  // Remove spinner after completion
        }
    });
});

//4:54pm