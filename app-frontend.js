const API = "http://localhost:5000/api";

let token = localStorage.getItem("token");
let role = localStorage.getItem("role");
let chart;

if (token) showDashboard();


// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/users/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  token = data.token;
  role = data.user.role;

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);

  showDashboard();
}


// SHOW DASHBOARD
function showDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboardPage").classList.remove("hidden");

  if (role !== "admin") {
    document.getElementById("addSection").style.display = "none";
  }

  loadDashboard();
  loadTransactions();
}


// DASHBOARD DATA
async function loadDashboard() {
  const res = await fetch(`${API}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  document.getElementById("income").innerText = `₹${data.totalIncome}`;
  document.getElementById("expense").innerText = `₹${data.totalExpense}`;
  document.getElementById("balance").innerText = `₹${data.balance}`;

  renderChart(data.totalIncome, data.totalExpense);
}


// CHART
function renderChart(income, expense) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense]
      }]
    }
  });
}


// TRANSACTIONS
async function loadTransactions() {
  const res = await fetch(`${API}/transactions`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();

  const container = document.getElementById("transactions");
  container.innerHTML = "";

  data.data.forEach(tx => {
    const div = document.createElement("div");
    div.className = "tx";

    div.innerHTML = `
      <span>${tx.type} - ₹${tx.amount} (${tx.category})</span>
      ${
        role === "admin"
          ? `<button onclick="deleteTx(${tx.id})">Delete</button>`
          : ""
      }
    `;

    container.appendChild(div);
  });
}


// ADD
async function addTransaction() {
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  await fetch(`${API}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ amount, type, category })
  });

  loadDashboard();
  loadTransactions();
}


// DELETE
async function deleteTx(id) {
  await fetch(`${API}/transactions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadTransactions();
}


// LOGOUT
function logout() {
  localStorage.clear();
  location.reload();
}