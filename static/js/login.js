document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        alert("Login successful");
        window.location.href = "/"; // Перенаправление на главную страницу
    } catch (error) {
        console.error("Error during login:", error);
    }
});
