
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




const transactionList = document.getElementById("transaction-list");
const transactionForm = document.getElementById("transaction-form");

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
