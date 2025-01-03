    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('contact-form');
        const responseMessage = document.createElement('p'); // Element to show messages
        form.appendChild(responseMessage); // Add to the form

        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            fetch(form.action, {
                method: form.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form))) // Convert form data to JSON
            })
            .then(response => {
                if (response.ok) {
                    responseMessage.textContent = 'Message sent successfully!';
                    responseMessage.style.color = 'green';
                    form.reset(); // Clear the form fields
                } else {
                    responseMessage.textContent = 'Something went wrong. Please try again.';
                    responseMessage.style.color = 'red';
                }
            })
            .catch(error => {
                responseMessage.textContent = 'An error occurred. Please try again.';
                responseMessage.style.color = 'red';
            });
        });
    });


    // This code is for https://www.emailjs.com/
// // Wait for the document to be fully loaded before attaching the event
// document.addEventListener('DOMContentLoaded', function () {
//     console.log('DOM fully loaded and parsed');

//     // Initialize EmailJS with your public key
//     emailjs.init('S4_FpugIJ1eijhYxZ'); // Replace with your actual public key
//     console.log('EmailJS Object:', emailjs);

//     // Get the form element
//     const form = document.getElementById('contact-form');
//     if (!form) {
//         console.error('Form element not found!');
//         return;
//     }
//     console.log('Form Element:', form);

//     // Attach form submission handler
//     form.addEventListener('submit', function (event) {
//         console.log('Form submit event triggered');

//         event.preventDefault(); // Prevent the default form submission

//         // Collect form data
//         const name = document.getElementById('name').value.trim();
//         const email = document.getElementById('email').value.trim();
//         const message = document.getElementById('message').value.trim();

//         console.log('Form Data:', { name, email, message });

//         // Validate form data
//         if (!name.trim() || !email.trim() || !message.trim()) {
//             alert('All fields are required!');
//             return;
//         }

//         // Send email using EmailJS
//         emailjs.send("service_61os3oc", "template_37c1mlc", {
//             name: name,
//             email: email,
//             message: message
//         }).then(function (response) {
//             console.log('Success!', response);
//             alert('Message sent successfully!');
//             form.reset(); // Reset the form after successful submission
//         }).catch(function (error) {
//             console.error('Failed...', error);
//             alert('Something went wrong. Please try again.');
//         });
//     });
// });
