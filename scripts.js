document.addEventListener("DOMContentLoaded", function () {
    const openPopupLink = document.querySelector(".open-popup-link");
    const loginPopup = document.getElementById("loginPopup");
    const signupPopup = document.getElementById("signupPopup");
    const forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
    
    const closeButtons = document.querySelectorAll(".close-btn");
    
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            loginPopup.style.display = "none";
            signupPopup.style.display = "none";
            forgotPasswordPopup.style.display = "none";
        });
    });
    
    openPopupLink.addEventListener("click", (event) => {
        event.preventDefault();
        loginPopup.style.display = "flex";
    });

    const switchForms = document.querySelectorAll(".switch-form");

    switchForms.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetPopup = document.querySelector(link.getAttribute("data-target"));
            loginPopup.style.display = "none";
            signupPopup.style.display = "none";
            forgotPasswordPopup.style.display = "none";
            targetPopup.style.display = "flex";
        });
    });

    // Handle form submissions
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const errorMessage = document.getElementById("error-message");
    const signupErrorMessage = document.getElementById("signup-error-message");
    const forgotPasswordErrorMessage = document.getElementById("forgot-password-error-message");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "" || password === "") {
            errorMessage.textContent = "Both fields are required.";
        } else {
            errorMessage.textContent = "";
            console.log("Login attempt with:", { username, password });
        }
    });

    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const newUsername = document.getElementById("new-username").value;
        const newPassword = document.getElementById("new-password").value;

        if (email === "" || newUsername === "" || newPassword === "") {
            signupErrorMessage.textContent = "All fields are required.";
        } else {
            signupErrorMessage.textContent = "";
            console.log("Sign up attempt with:", { email, newUsername, newPassword });
        }
    });

    forgotPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("forgot-email").value;

        if (email === "") {
            forgotPasswordErrorMessage.textContent = "Email is required.";
        } else {
            forgotPasswordErrorMessage.textContent = "";
            console.log("Password reset link sent to:", { email });
        }
    });
});
