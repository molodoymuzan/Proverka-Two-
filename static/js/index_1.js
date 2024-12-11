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
document.addEventListener("DOMContentLoaded", function() {
    transactionForm.addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Gather form data
        const formData = new FormData(transactionForm);
        const transactionData = {
            user_id: 1, // Replace with actual user ID
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
            addTransactionToList(result);
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
document.querySelector("#logout").addEventListener("click", logout);




const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");

