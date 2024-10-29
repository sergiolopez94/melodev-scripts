    document.addEventListener('DOMContentLoaded', function() {
        // Select the Webflow form using the specific ID
        const form = document.querySelector('#wf-form-Sorteo-Black-Friday');

        // Intercept form submission
        form.addEventListener('submit', async function(event) {
            event.preventDefault();  // Prevent Webflow's default form submission

            // Get form data
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const fileInput = document.querySelector('#file-upload');
            const file = fileInput.files[0];

            if (!file) {
                alert('Please upload a file.');
                return;
            }

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

            // Prepare the form data for the request
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('file', file, uniqueFilename);  // Attach file with new unique filename

            // Send the form data to your n8n webhook
            try {
                const response = await fetch('https://your-n8n-instance.com/webhook/your-webhook', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
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
