const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

function handleLogin() {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(loginForm);
        const data = {
            name: formData.get("username"), // Ensure the key matches the input name
            password: formData.get("password"),
        };

        try {
            const response = await fetch(`/api/user/login`, { // Use backticks for template literals
                method: "POST", // Ensure this matches your Go handler
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("userId", result.id);
                window.location.href = "/"; // Change to your main page
            } else {
                // Handle errors (e.g., invalid credentials)
                alert(result.message || "Login failed.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

function handleRegistration(){
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(registerForm);
        const data = {
            name: formData.get("username"),
            password: formData.get("password")
        };

        try {
            const response = await fetch("/api/newuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem("userId", result.id);

                window.location.href = "/"; // Change to your login page
            } else {
                // Handle errors (e.g., username already exists)
                alert(result.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

document.addEventListener("DOMContentLoaded", handleLogin);
document.addEventListener("DOMContentLoaded", handleRegistration);