// Configure AWS SDK with your region and Cognito Identity Pool ID
AWS.config.update({
    region: 'eu-central-1', // Replace with your AWS region
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-central-1_6ALIGKqOi',  // Corrected Cognito Identity Pool ID
    })
});

// Get the form element
const form = document.getElementById('contact-form');
if (!form) {
    console.error('Form element not found!');
} else {
    // Attach form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form data
        if (!name || !email || !message) {
            alert('Please fill out all fields.');
            return;
        }

        // Construct the SES email parameters
        const params = {
            Source: 'sim.atanasov@gmail.com',  // Your verified SES email address
            Destination: {
                ToAddresses: [email],  // Use the email provided by the user
            },
            Message: {
                Subject: {
                    Data: 'New Message from ' + name,  // Subject of the email
                },
                Body: {
                    Text: {
                        Data: `You have received a new message from ${name}.\n\nEmail: ${email}\nMessage: ${message}`, // Email body
                    },
                },
            },
        };

        // Create SES service object
        const ses = new AWS.SES();

        // Send the email
        ses.sendEmail(params, function(err, data) {
            if (err) {
                console.log('Error sending email:', err);
                alert('Something went wrong. Please try again.');
            } else {
                console.log('Success!', data);
                alert('Message sent successfully!');
                form.reset();  // Reset the form after successful submission
            }
        });
    });
}
