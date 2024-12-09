
function checkLoginStatus() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        window.location.href = 'login.html'; // Change to your login page
        return;
    }
}

function logout() {
    localStorage.removeItem('userId')
    window.location.href = 'login.html';
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);
document.querySelector("#logout").addEventListener("click", logout);
