document.addEventListener('DOMContentLoaded', function() {
    console.log("JavaScript loaded and ready.");

    // Select the Webflow form using the specific ID
    const form = document.querySelector('#wf-pf-form');

    if (!form) {
        console.error('Form with ID "wf-pf-form" not found.');
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
    form.addEventListener('submit', function(event) {
        console.log("Form submission intercepted.");

        // Disable the button and change the value to 'Por favor espere...'
        submitButton.value = "Por favor espere...";
        submitButton.disabled = true;

        // Check that all inputs are present
        const nameInput = document.querySelector('#Name');
        const lastInput = document.querySelector('#Last');
        const ageInput = document.querySelector('#Age');
        const emailInput = document.querySelector('#email');
        const phoneInput = document.querySelector('#phone');
        const cityInput = document.querySelector('#city');
        const codeInput = document.querySelector('#code');

        if (!nameInput || !lastInput || !ageInput || !emailInput || !phoneInput || !cityInput || !codeInput) {
            console.error('One or more form fields not found.');
            submitButton.value = "Someter";  // Revert button text
            submitButton.disabled = false;
            // Let the form submit anyway or prevent it? Uncomment below to block:
            // event.preventDefault();
        } else {
            console.log("All input fields found. Letting Webflow handle the submission.");
            // Don't prevent default — allow Webflow to submit normally
        }
    });
});
