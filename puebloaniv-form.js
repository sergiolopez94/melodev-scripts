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
            console.log("Missing fields:", {
                name: !nameInput,
                last: !lastInput,
                age: !ageInput,
                email: !emailInput,
                phone: !phoneInput,
                city: !cityInput,
                code: !codeInput
            });
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
        console.log("Form data prepared:", {
            name, last, age, email, phone, city, code
        });

        try {
            // Add the specific n8n authentication header
            const headers = new Headers();
            headers.append('api-key', 'puebloaniv-form-2025-05-09');
            console.log("Headers prepared:", [...headers.entries()]);
            
            console.log("About to send request to webhook...");
            const response = await fetch('https://n8n.melodev.com/webhook/pueblo-aniversario-form', {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            console.log("Response received from webhook:", response);
            console.log("Response status:", response.status);
            console.log("Response headers:", [...response.headers.entries()]);
            
            // Debug response
            console.log("Response type:", response.type);
            console.log("Is response redirected?", response.redirected);
            console.log("Response URL:", response.url);
            
            if (response.ok) {
                console.log("Response is OK, trying to parse JSON...");
                
                // Let's check the response text first
                const responseText = await response.text();
                console.log("Raw response text:", responseText);
                
                // Now try to parse it as JSON if it's not empty
                let data;
                if (responseText.trim()) {
                    try {
                        data = JSON.parse(responseText);
                        console.log("Parsed JSON response data:", data);
                    } catch (parseError) {
                        console.error("JSON parse error:", parseError);
                        alert('Invalid response format. Please try again.');
                        submitButton.value = "Someter";
                        submitButton.disabled = false;
                        return;
                    }
                } else {
                    console.log("Response body is empty");
                    // If response is empty but status is 200, we can still redirect to a default URL
                    window.location.href = 'https://www.virtual.puebloweb.com/gracias';
                    return;
                }
                
                // Handle array response - get the first object in the array
                const responseObj = Array.isArray(data) && data.length > 0 ? data[0] : data;
                
                if (responseObj && responseObj.redirectUrl) {
                    console.log("Redirecting to:", responseObj.redirectUrl);
                    window.location.href = responseObj.redirectUrl; // Redirect to the provided URL
                } else {
                    console.error("No redirectUrl found in response:", data);
                    // If we have a 200 OK but no redirectUrl, use default redirect
                    console.log("Using default redirect URL");
                    window.location.href = 'https://www.virtual.puebloweb.com/gracias';
                }
            } else {
                console.error('Failed to submit form:', response.statusText);
                alert('Failed to submit form. Please try again.');
                submitButton.value = "Someter";  // Revert button text on failure
                submitButton.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            console.error('Error details:', error.message, error.stack);
            alert('An error occurred. Please try again.');
            submitButton.value = "Someter";  // Revert button text on error
            submitButton.disabled = false;
        }
    });
});