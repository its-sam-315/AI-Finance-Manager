const baseURL = "https://ai-finance-manager-d9k7.onrender.com";  // Live backend URL

document.getElementById("transaction-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let description = document.getElementById("description").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;
    let category = document.getElementById("category").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    let transaction = { description, amount, type, category };

    // Send transaction to backend
    const response = await fetch(`${baseURL}/transactions`, {   // Updated URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
    });

    if (response.ok) {
        fetchTransactions(); // Refresh transactions after adding
        document.getElementById("transaction-form").reset();
    } else {
        alert("Failed to add transaction.");
    }
});

// Fetch transactions from backend
async function fetchTransactions() {
    const response = await fetch(`${baseURL}/transactions`);  // Updated URL
    const transactions = await response.json();

    let transactionList = document.getElementById("transaction-list");
    transactionList.innerHTML = "";

    transactions.forEach(transaction => {
        let listItem = document.createElement("li");
        listItem.textContent = `${transaction.description} (${transaction.category}): ${transaction.type === "income" ? "+" : "-"}$${transaction.amount}`;
        transactionList.appendChild(listItem);
    });

    updateBalance(transactions);
}

// Update balance
function updateBalance(transactions) {
    let totalBalance = transactions.reduce((acc, transaction) => {
        return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    document.getElementById("total-balance").textContent = totalBalance.toFixed(2);
}

// Load transactions on page load
fetchTransactions();
