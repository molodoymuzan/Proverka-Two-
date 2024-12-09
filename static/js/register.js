document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Registration failed");
        }

        alert("Registration successful");
        window.location.href = "/login"; // Перенаправление на страницу входа
    } catch (error) {
        console.error("Error during registration:", error);
    }
});
