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
        
        // Find the reCAPTCHA field - Webflow usually adds it with g-recaptcha-response name
        const recaptchaInput = document.querySelector('[name="g-recaptcha-response"]');

        if (!nameInput || !lastInput || !ageInput || !emailInput || !phoneInput || !cityInput || !codeInput) {
            console.error('One or more form fields not found.');
            submitButton.value = "Someter";  // Revert button text if there's an error
            submitButton.disabled = false;
            return;
        }
        console.log("All input fields found.");
        
        // Check if reCAPTCHA response exists and is not empty
        if (!recaptchaInput || !recaptchaInput.value) {
            console.error('reCAPTCHA validation is missing or empty');
            alert('Por favor complete el reCAPTCHA.');
            submitButton.value = "Someter";
            submitButton.disabled = false;
            return;
        }
        console.log("reCAPTCHA response found");

        const name = nameInput.value;
        const last = lastInput.value;
        const age = ageInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const city = cityInput.value;
        const code = codeInput.value;
        const recaptchaToken = recaptchaInput.value;

        // Prepare the form data for the request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('last', last);
        formData.append('age', age);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('city', city);
        formData.append('code', code);
        formData.append('g-recaptcha-response', recaptchaToken); // Add the reCAPTCHA token
        console.log("Form data prepared with reCAPTCHA token");

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
                    alert('Unexpected response. Please try again.');
                    submitButton.value = "Someter";
                    submitButton.disabled = false;
                    return;
                }
                
                // Handle array response - get the first object in the array
                const responseObj = Array.isArray(data) && data.length > 0 ? data[0] : data;
                
                if (responseObj) {
                    // Extract the prize information
                    const status = responseObj.status || false;
                    const message = responseObj.message || '';
                    const prize = responseObj.prize || '';
                    const prizeDesc = responseObj['prize-desc'] || '';
                    
                    // Store prize information in sessionStorage so it can be accessed on the next page
                    sessionStorage.setItem('prize_status', status);
                    sessionStorage.setItem('prize_message', message);
                    sessionStorage.setItem('prize_name', prize);
                    sessionStorage.setItem('prize_description', prizeDesc);
                    
                    // Log what we're storing
                    console.log("Storing prize information:", {
                        status,
                        message,
                        prize,
                        prizeDesc
                    });
                    
                    if (responseObj.redirectUrl) {
                        console.log("Redirecting to:", responseObj.redirectUrl);
                        window.location.href = responseObj.redirectUrl; // Redirect to the provided URL
                    } else {
                        console.error("No redirectUrl found in response:", responseObj);
                        alert('Unexpected response. Please try again.');
                        submitButton.value = "Someter";
                        submitButton.disabled = false;
                    }
                } else {
                    console.error("Invalid response format:", data);
                    alert('Unexpected response. Please try again.');
                    submitButton.value = "Someter";  // Revert button text on error
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
    
    // Prize page logic - this will run on any page, but only do something on the prize page
    // We'll use a more generic check that will work with any redirect URL
    if (sessionStorage.getItem('prize_status') !== null) {
        console.log("Prize information found in session, checking if we're on the prize page");
        
        // Get the stored prize information
        const status = sessionStorage.getItem('prize_status');
        const message = sessionStorage.getItem('prize_message');
        const prize = sessionStorage.getItem('prize_name');
        const prizeDesc = sessionStorage.getItem('prize_description');
        
        console.log("Retrieved prize information:", {
            status,
            message,
            prize,
            prizeDesc
        });
        
        // Find elements to update with prize information
        const messageElement = document.querySelector('[data-prize-message]');
        const prizeElement = document.querySelector('[data-prize-name]');
        const prizeDescElement = document.querySelector('[data-prize-description]');
        
        // Only proceed if we find any of these elements (which means we're on the prize page)
        if (messageElement || prizeElement || prizeDescElement) {
            console.log("Found prize elements on page, updating content");
            
            // Update elements if they exist
            if (messageElement) messageElement.textContent = message;
            if (prizeElement) prizeElement.textContent = prize;
            if (prizeDescElement) prizeDescElement.textContent = prizeDesc;
            
            // You might also want to show/hide elements based on status
            if (status === 'true') {
                // Show winning elements
                document.querySelectorAll('[data-prize-winner]').forEach(el => {
                    el.style.display = 'block';
                });
                // Hide non-winning elements
                document.querySelectorAll('[data-prize-no-winner]').forEach(el => {
                    el.style.display = 'none';
                });
            } else {
                // Show non-winning elements
                document.querySelectorAll('[data-prize-no-winner]').forEach(el => {
                    el.style.display = 'block';
                });
                // Hide winning elements
                document.querySelectorAll('[data-prize-winner]').forEach(el => {
                    el.style.display = 'none';
                });
            }
            
            // Clear the session storage after displaying the information
            // This prevents the info from persisting across multiple page loads
            // Comment this out if you want the info to persist until the browser is closed
            // sessionStorage.removeItem('prize_status');
            // sessionStorage.removeItem('prize_message');
            // sessionStorage.removeItem('prize_name');
            // sessionStorage.removeItem('prize_description');
        }
    }
});