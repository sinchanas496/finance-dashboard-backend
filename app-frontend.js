let token = "";
let userRole = "";
let chart;

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;

    // decode role
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.role;

    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    // role-based UI
    if (userRole === "viewer") {
      document.getElementById("formBox").style.display = "none";
    }

    loadTransactions();

  } else {
    document.getElementById("error").innerText = data.message;
  }
}

// LOGOUT
function logout() {
  location.reload();
}

// ADD TRANSACTION
async function addTransaction() {
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  await fetch("http://localhost:5000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ amount, type, category })
  });

  loadTransactions();
}

// LOAD DATA
async function loadTransactions() {
  const res = await fetch("http://localhost:5000/api/transactions", {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  const data = await res.json();

  renderList(data.data);
  renderChart(data.data);
}

// DELETE
async function deleteTransaction(id) {
  await fetch(`http://localhost:5000/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  loadTransactions();
}

// LIST UI
function renderList(transactions) {
  const list = document.getElementById("list");
  list.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${t.type} - ₹${t.amount} (${t.category})
      ${userRole === 'admin' ? `<span class="delete" onclick="deleteTransaction(${t.id})">Delete</span>` : ""}
    `;

    list.appendChild(li);
  });
}

function renderChart(data) {
  let income = 0, expense = 0;

  data.forEach(t => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  // ✅ UPDATE STATS UI
  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;

  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    }
  });

}