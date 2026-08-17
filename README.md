# Vanta Bags 👜

A modern full-stack e-commerce application for browsing, purchasing, and managing premium bags.

Vanta Bags is built with a React frontend and a Node.js/Express backend, with MongoDB for persistent data, JWT-based authentication, Cloudinary for image management, and Razorpay for payments.

---

## ✨ Features

### 🛍️ Customer Features

- User registration and login
- JWT-based authentication
- Product browsing
- Product search
- Product filtering and sorting
- Category-based collections
- Product detail pages
- Shopping cart
- Wishlist
- Recently viewed products
- Checkout
- Razorpay payment integration
- Order placement
- Order history
- Order details
- Saved customer addresses
- Product reviews
- Responsive design
- Light/Dark theme

### 👨‍💼 Admin Features

- Admin authentication and protected routes
- Admin dashboard
- Product management
- Product creation and editing
- Product image uploads
- Category management
- Order management
- Order details
- Order status management
- Sales/analytics dashboard

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- React Hook Form
- Recharts
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Zod

### Third-Party Services

- Cloudinary - Image/media storage
- Razorpay - Payment processing

### Testing & Development

- Vitest
- Supertest
- Nodemon
- ESLint

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      Vanta Bags     │
                    │     React Client    │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │   Node.js + Express │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
          ┌────────────┐ ┌───────────┐ ┌────────────┐
          │  MongoDB   │ │ Cloudinary│ │  Razorpay  │
          │  Database  │ │   Images  │ │  Payments  │
          └────────────┘ └───────────┘ └────────────┘