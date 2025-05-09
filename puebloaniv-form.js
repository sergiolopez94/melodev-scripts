document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript loaded and ready.");

    // Select the Webflow form using the specific ID
    const form = document.querySelector('#wf-form-aniversario');

    if (!form) {
        console.error('Form with ID "wf-form-aniversario" not found.');
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

        // Disable the button and change the value to 'Por favor espere...'
        submitButton.value = "Por favor espere...";
        submitButton.disabled = true;

        // Get form fields
        const nameInput = document.querySelector('#name');
        const lastInput = document.querySelector('#last');
        const ageInput = document.querySelector('#age');
        const emailInput = document.querySelector('#email');
        const phoneInput = document.querySelector('#phone');
        const cityInput = document.querySelector('#city');
        const codeInput = document.querySelector('#code');

        if (!nameInput || !lastInput || !ageInput || !emailInput || !phoneInput || !cityInput || !codeInput) {
            console.error('One or more form fields not found.');
            submitButton.value = "Someter";  // Revert button text if there's an error
            submitButton.disabled = false;
            return;
        }
        console.log("All input fields found.");

        const name = nameInput.value;
        const last = lastInput.value;
        const age = ageInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const city = cityInput.value;
        const code = codeInput.value;

        // Prepare the form data for the request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('last', last);
        formData.append('age', age);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('city', city);
        formData.append('code', code);
        console.log("Form data prepared:", formData);

        try {
            // Add the specific n8n authentication header
            const headers = new Headers();
            headers.append('api-key', 'puebloaniv-form-2025-05-09');
            
            const response = await fetch('https://n8n.melodev.com/webhook/pueblo-aniversario-form', {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            console.log("Response received from webhook:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Parsed JSON response data:", data);
                
                // Handle array response - get the first object in the array
                const responseObj = Array.isArray(data) && data.length > 0 ? data[0] : data;
                
                if (responseObj && responseObj.redirectUrl) {
                    console.log("Redirecting to:", responseObj.redirectUrl);
                    window.location.href = responseObj.redirectUrl; // Redirect to the provided URL
                } else {
                    console.error("No redirectUrl found in response:", data);
                    alert('Unexpected response. Please try again.');
                    submitButton.value = "Someter";  // Revert button text if no redirectUrl
                    submitButton.disabled = false;
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
        }
    });
});