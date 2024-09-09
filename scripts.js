document.addEventListener("DOMContentLoaded", function () {
    // Popup functionality
    const openPopupLinks = document.querySelectorAll('.open-popup-link');
    const closeBtns = document.querySelectorAll('.close-btn');
    const signInForm = document.getElementById('loginPopup');
    const signUpForm = document.getElementById('signupPopup');
    const forgotPasswordForm = document.getElementById('forgotPasswordPopup');

    openPopupLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            signInForm.style.display = 'flex'; // Display the sign-in form popup
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            signInForm.style.display = 'none';
            signUpForm.style.display = 'none';
            forgotPasswordForm.style.display = 'none';
        });
    });

    // Form toggle functionality
    document.querySelectorAll('.switch-form').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.popup-container').forEach(popup => popup.style.display = 'none');
            const target = document.querySelector(link.dataset.target);
            if (target) target.style.display = 'flex';
        });
    });

    // Form validation
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            form.querySelectorAll('input').forEach(input => {
                const errorMessage = input.nextElementSibling;
                if (input.value.trim() === '') {
                    isValid = false;
                    errorMessage.textContent = 'This field is required';
                    errorMessage.style.display = 'block';
                } else {
                    errorMessage.style.display = 'none';
                }
            });

            if (isValid) {
                alert('Form submitted successfully!');
            }
        });
    });

    // Clear error messages when user starts typing
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function () {
            const errorMessage = input.nextElementSibling;
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburger.addEventListener('click', function () {
        mobileMenu.classList.toggle('show');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('show');
            hamburger.classList.remove('active');
        });
    });
});

// Select the lightbox and its components
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const closeLightbox = document.querySelector('.close-lightbox');

// Event listener for opening lightbox
document.querySelectorAll('.synopsis-gallery .gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImage.src = img.getAttribute('data-src'); // Set the image src
        lightbox.style.display = 'flex'; // Show lightbox
    });
});

// Event listener for closing lightbox
closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none'; // Hide lightbox
});
