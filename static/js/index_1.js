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
async function fetchUserData() {
    // Get user ID from local storage
    const userId = localStorage.getItem('userId'); // Make sure 'userId' is set in local storage

    if (!userId) {
        console.error("User ID not found in local storage.");
        return;
    }

    try {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'PUT', // Use PUT as specified in your router
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const userData = await response.json();
        // Assuming the user data contains a 'name' field
        document.getElementById('user-name').textContent = userData.name || 'User';


    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


document.addEventListener("DOMContentLoaded", checkLoginStatus);
document.addEventListener("DOMContentLoaded", fetchUserData);
document.addEventListener("DOMContentLoaded", function () {
    transactionForm.addEventListener("submit", async function (event) {
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

        try {
            // Send the transaction data to the server
            const response = await fetch('/api/transaction/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            // Add the new transaction to the list
            displayTransactions(result);
            // Reset the form
            transactionForm.reset();
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Failed to add transaction: ' + error.message);
        }
    });

    function addTransactionToList(transaction) {
        const listItem = document.createElement("li");
        listItem.textContent = `${transaction.month}: ${transaction.description} - ${transaction.amount} (${transaction.type})`;
        transactionList.appendChild(listItem);
    }
});
document.addEventListener("DOMContentLoaded", fetchTransactions);
document.querySelector("#logout").addEventListener("click", logout);




const tableBody = document.getElementById('transaction-list');
const transactionForm = document.getElementById("transaction-form");



function fetchTransactions() {
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
            displayTransactions(transactions);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}


function displayTransactions(transactions) {
    transactions.forEach(item => {
        const row = document.createElement('tr');

        row.id = item.id
        row.innerHTML = `
        <td>${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.category}</td>
        <td>${item.description}</td>
        <td>${formatDate(item.date)}</td>
        <td><button class="btn" onclick="deleteTransaction(this)">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });



}

function deleteTransaction(button) {
    const row = button.parentElement.parentElement; // Get the row of the button
    removeTransactionFromDB(+row.id);
    row.parentElement.removeChild(row); // Remove the row from the table
}
function removeTransactionFromDB(transactionId) {
    const userId = +localStorage.getItem("userId")
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
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function formatDate(dateString) {
    const date = new Date(dateString); // Create a Date object from the date string
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed) and pad with leading zero
    const year = date.getFullYear(); // Get the full year

    return `${day}-${month}-${year}`; // Return the formatted date as DD-MM-YYYY
}
