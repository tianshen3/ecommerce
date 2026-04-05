# MERN E-Commerce Platform

A fully functional, responsive e-commerce web application built using the MERN stack (MongoDB, Express.js, React, Node.js). 

This project features a customer-facing storefront for browsing and purchasing products, and a secured admin dashboard for managing inventory and tracking orders.

## 🌟 Features

### Customer Storefront (`frontend`)
- **Responsive Design:** Beautiful, dynamic UI built with React and styled optimally for all network devices.
- **Product Browsing & Cart:** Users can browse the collection, view product details, and add items to a persistent shopping cart.
- **User Authentication:** Secure JWT-based login and registration system.
- **Checkout system:** Complete logic for placing orders securely.

### Admin Dashboard (`admin`)
- **Inventory Management:** Full CRUD operations to add, edit, or delete store products.
- **Order Tracking:** Admins can view incoming orders and manage the operational process.
- **Secure Access:** Admin-protected routes so only authorized store owners can manage backend data.

### Robust Backend (`backend`)
- **RESTful API:** Structured and cleanly routed API endpoints for users, products, and orders using Express.js.
- **Data Modeling:** Reliable and scalable database schemas created using Mongoose for MongoDB.
- **Security:** User password hashing (bcrypt) and robust JWT endpoint protection.
- **Image Handling:** API endpoints designed to safely handle product asset uploads.

## 🛠️ Technology Stack

- **Frontend:** React, React Router, Vite, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## 🚀 Running Locally

To run this project locally, you will need to start all three parts of the application: the backend, the frontend, and the admin panel.

### Prerequisites
- Node.js installed
- A local MongoDB instance or a MongoDB Atlas connection URI

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file locally with your MONGODB_URI, JWT_SECRET, and PORT.
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Admin Setup
```bash
cd admin
npm install
npm run dev
```

## 🌐 Deployment
This application is designed to be deployed across separate specialized services:
- **Database:** MongoDB Atlas
- **Backend:** Render or Railway
- **Frontend & Admin:** Vercel or Netlify

Remember to ensure your deployed frontend and admin environments point to the deployed backend's URL instead of `localhost`.
