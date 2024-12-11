const tableBody = document.getElementById('transaction-list');
const transactionForm = document.getElementById("transaction-form");
const canvas = document.getElementById('circle');

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
function getUserName() {
    const userId = localStorage.getItem('userId'); // Make sure 'userId' is set in local storage

    if (!userId) {
        console.error("User ID not found in local storage.");
        return;
    }

    fetch(`/api/user/${userId}`, {
        method: 'PUT', // Use PUT as specified in your router
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {
            // Assuming the user data contains a 'name' field
            document.getElementById('user-name').textContent = userData.name || 'User';
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

function getAllTransactions() {
    const id = +localStorage.getItem("userId")

    fetch('/api/transaction/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(transactions => {
            displayAllTransactions(transactions);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function addTransaction(event) {
    event.preventDefault(); // Prevent the default form submission

    const id = +localStorage.getItem("userId");

    const formData = new FormData(transactionForm);
    const transactionData = {
        user_id: id, // Replace with actual user ID
        amount: parseFloat(formData.get("amount")),
        type: formData.get("type"),
        category: formData.get("category"),
        description: formData.get("description"),
        date: formData.get("date")
    };

    // Send the transaction data to the server
    fetch('/api/transaction/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            getAllTransactions()
        })
        .catch(error => {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction: ' + error.message);
        });
}
function displayAllTransactions(transactions) {
    let totalIncome = 0;
    let totalExpenses = 0;

    tableBody.innerHTML = "";

    transactions.forEach(item => {
        const row = document.createElement('tr');

        row.id = item.id
        row.innerHTML = `
        <td>${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.category}</td>
        <td>${item.description}</td>
        <td>${formatDate(item.date)}</td>
        <td><button class="btn" onclick="removeTransaction(this)">Delete</button></td>
        `;
        tableBody.appendChild(row);

        if (item.type === "income")
            totalIncome += +item.amount
        else
            totalExpenses += +item.amount
    });

    displayCircle(totalIncome, totalExpenses)
}
function removeTransaction(button) { 
    const userId = +localStorage.getItem("userId")
    const transactionId = +button.parentElement.parentElement.id;

    fetch('/api/transaction/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: transactionId,
            user_id: userId
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        } else {
            getAllTransactions()
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    
}

// Utilities
function displayCircle(income, expenses) {
    const total = income + expenses;

    if (total === 0) {
        console.log("Total income and expenses cannot be zero.");
        return;
    }

    const incomeRatio = income / total;
    const expensesRatio = expenses / total;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 100, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * incomeRatio));
    ctx.lineTo(100, 100);
    ctx.fillStyle = '#4caf50';
    ctx.fill();
    ctx.closePath();


    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 100, -Math.PI / 2 + (Math.PI * 2 * incomeRatio), -Math.PI / 2 + (Math.PI * 2 * (incomeRatio + expensesRatio)));
    ctx.lineTo(100, 100);
    ctx.fillStyle = '#ff2424';
    ctx.fill();
    ctx.closePath();
}
function formatDate(dateString) {
    const date = new Date(dateString); // Create a Date object from the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed) and pad with leading zero
    const year = date.getFullYear(); // Get the full year

    return `${day}-${month}-${year}`; // Return the formatted date as DD-MM-YYYY
}


document.addEventListener("DOMContentLoaded", checkLoginStatus);
document.addEventListener("DOMContentLoaded", getUserName);
document.addEventListener("DOMContentLoaded", () => transactionForm.addEventListener("submit", addTransaction));
document.addEventListener("DOMContentLoaded", getAllTransactions);
document.querySelector("#logout").addEventListener("click", logout);
