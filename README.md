 Finance Dashboard Backend

 Project Overview

This project is a backend system for a finance dashboard application. It manages users and financial transactions with role-based access control. Different users (admin, analyst, viewer) can perform actions based on their permissions.



Features

 Authentication

* User login using email and password
* JWT-based authentication
* Only valid users can access the system



 Role-Based Access Control

Admin:

* Can add transactions
* Can delete transactions (soft delete)
* Can view all transactions

Analyst:

* Can view all transactions
* Can analyze data (charts, summary)
* Cannot add or delete transactions

Viewer:

* Can view only their own transactions
* Cannot add or delete transactions


 Transaction Management

* Add transaction (admin only)
* Soft delete transaction (admin only)
* View transactions based on role
* Filter transactions by type and category
* Search transactions
* Pagination support


 Dashboard

* Shows total income
* Shows total expenses
* Shows balance
* Used for data analysis (frontend)


 Technologies Used

* Node.js
* Express.js
* MySQL (XAMPP)
* JWT Authentication



 Database Details

Database name: finance_dashboard

 Users Table

* id (int)
* name (varchar)
* email (varchar)
* password (varchar)
* role (admin / analyst / viewer)
* status (active / inactive)
* created_at (timestamp)


 Transactions Table

* id (int)
* amount (int)
* type (income / expense)
* category (varchar)
* date (date)
* user_id (int)
* is_deleted (0 or 1)
* created_at (timestamp)
* notes (text)


 Setup Instructions

1. Start XAMPP and run Apache and MySQL.

2. Open phpMyAdmin and create a database:
   finance_dashboard

3. Create the required tables:
   users and transactions

4. Install dependencies:
   npm install

5. Run the backend server:
   node app.js

6. Server will run on:
   http://localhost:5000


 Test Users

Admin:
email: [sinchana@gmail.com](mailto:sinchana@gmail.com)
password: 1234

Analyst:
email: [analyst@gmail.com](mailto:analyst@gmail.com)
password: 1234

Viewer:
email: [viewer@gmail.com](mailto:viewer@gmail.com)
password: 1234


 API Endpoints

Auth:
POST /api/users/login

Transactions:
GET /api/transactions
POST /api/transactions (admin only)
DELETE /api/transactions/:id (admin only)

Dashboard:
GET /api/dashboard


 Additional Work Done

* Implemented role-based filtering in backend
* Added JWT authentication
* Implemented soft delete for transactions
* Added filtering, search, and pagination
* Structured code using controllers, services, and routes


 Conclusion

This project demonstrates backend development with authentication, authorization, and transaction management using Node.js and MySQL.
