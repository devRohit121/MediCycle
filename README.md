# MediCycle 🩺

A full-stack web application for managing and redistributing near-expiry medicines with role-based workflows, inventory validation, and order lifecycle management.

---

## 🚀 Live Demo
👉 https://medicycle-wvdn.onrender.com/batches

---

## 📌 Overview

MediCycle is designed to reduce medicine waste by enabling sellers to list near-expiry batches and buyers to purchase them efficiently. The system ensures data integrity through strict validation, expiry checks, and controlled order processing.

---

## 👥 Roles & Features

### 🛒 Buyer
- Browse available medicine batches
- View batch details (expiry, price, quantity)
- Place orders
- Track order status (Pending / Accepted / Rejected)
- Receive notifications on order updates

---

### 🏪 Seller
- Add, edit, and delete medicine batches
- Manage inventory with expiry tracking
- View incoming orders
- Accept or reject orders
- Automatic stock updates on order acceptance

---

### 🛠️ Admin
- View and manage all users
- Monitor all orders in the system
- View and remove invalid/expired inventory
- System-level visibility and control

---

## ⚙️ Tech Stack

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Frontend**
- EJS (templating)
- CSS

**Authentication & Validation**
- Passport.js (authentication)
- Joi (schema validation)

---

## 🧠 Key Concepts Implemented

- Role-Based Access Control (RBAC)
- MVC Architecture
- Server-side Validation (Joi)
- Secure Authentication (Passport)
- Inventory Consistency Handling
- Expiry-based Filtering
- Atomic stock updates (race condition handling)
- Flash messages for UX feedback
- Pagination for scalability

---

## 🔄 Order Workflow

```text
Buyer places order
        ↓
Status = Pending
        ↓
Seller reviews order
   ↙           ↘
Accept        Reject
   ↓             ↓
Stock updates   No change
