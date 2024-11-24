// Wait for the document to be fully loaded before attaching the event
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Initialize EmailJS with your public key
    emailjs.init('cC9ZXuKhIU28v9cc'); // Replace with your actual public key
    console.log('EmailJS Object:', emailjs);

    // Get the form element
    const form = document.getElementById('contact-form');
    if (!form) {
        console.error('Form element not found!');
        return;
    }
    console.log('Form Element:', form);

    // Attach form submission handler
    form.addEventListener('submit', function (event) {
        console.log('Form submit event triggered');

        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        console.log('Form Data:', { name, email, message });

        // Validate form data
        if (!name || !email || !message) {
            alert('Please fill out all fields.');
            return;
        }

        // Send email using EmailJS
        emailjs.send("service_8zv06ua", "template_pdg5xhr", {
            name: name,
            email: email,
            message: message
        }).then(function (response) {
            console.log('Success!', response);
            alert('Message sent successfully!');
            form.reset(); // Reset the form after successful submission
        }).catch(function (error) {
            console.error('Failed...', error);
            alert('Something went wrong. Please try again.');
        });
    });
});
