let currentMonthIndex = 11; // Декабрь (0 - Январь, 11 - Декабрь)
const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function changeMonth(direction) {
    currentMonthIndex += direction;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11; // Переход к декабрю
    } else if (currentMonthIndex > 11) {
        currentMonthIndex = 0; // Переход к январю
    }
    document.getElementById("month").textContent = months[currentMonthIndex];
    loadTransactions();
}

async function loadTransactions() {
    const currentMonth = months[currentMonthIndex];
    try {
        const response = await fetch(`/transactions?month=${currentMonth}`);
        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }
        const transactions = await response.json();

        const transactionList = document.getElementById("transactionHistory");
        transactionList.innerHTML = "";

        transactions.forEach(transaction => {
            const li = document.createElement("li");
            li.textContent = `${transaction.type}: ${transaction.amount}`;
            transactionList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

// Загрузка транзакций при загрузке страницы
document.addEventListener("DOMContentLoaded", loadTransactions);
