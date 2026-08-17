# Vanta Bags Frontend

A modern React e-commerce frontend for a bag-shopping experience. The application is built with React 19, Vite, React Router, Zustand, Axios, React Hook Form, Recharts, Lucide React, React Hot Toast, and Tailwind CSS.

## Overview

The frontend provides:

- Product browsing and product detail pages
- Category-based product collections
- Product filtering, sorting, and pagination
- Authentication flows for login and registration
- Shopping cart and wishlist
- Recently viewed products
- Checkout and order placement flow
- Customer account and saved addresses
- Order history and order details
- Order-success flow
- Admin dashboard
- Admin product management
- Admin order management and order details
- Light/dark theme support
- Responsive layouts
- Error boundary and toast notifications
- API service modules separated from UI components

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and component architecture |
| Vite | Development server and production build |
| React Router | Client-side routing |
| Zustand | Application state management |
| Axios | HTTP/API communication |
| React Hook Form | Form handling |
| Recharts | Dashboard/data visualization |
| Lucide React | Icons |
| React Hot Toast | User notifications |
| Tailwind CSS | Utility-first styling |
| ESLint | Code quality and linting |

## Project Structure

```text
src/
├── assets/                 # Images and static frontend assets
├── components/             # Reusable UI components
│   ├── admin/              # Admin-specific components
│   ├── checkout/           # Checkout sections and forms
│   └── collection/         # Product collection UI
├── constants/              # Shared constants
├── context/                # React context providers
├── data/                   # Static frontend data
├── hooks/                  # Reusable application hooks
├── layouts/                # Main and admin layouts
├── pages/                  # Route-level pages
│   └── admin/              # Admin pages
├── services/               # API/service layer
├── store/                  # Zustand stores
├── styles/                 # Shared style definitions
└── utils/                  # Utility functions and Tailwind helpers
```

## Main Routes

### Storefront

- `/` - Home
- `/products` - Product listing
- `/products/:slug` - Product details
- `/category` - Category listing
- `/category/:slug` - Category collection
- `/about` - About page
- `/cart` - Shopping cart
- `/wishlist` - Wishlist
- `/recently-viewed` - Recently viewed products

### Customer

- `/login` - Login
- `/register` - Registration
- `/account` - Account
- `/account/orders` - Customer order history
- `/account/addresses` - Saved addresses
- `/orders/:id` - Order details
- `/checkout` - Checkout
- `/order-success/:orderId` - Successful order page

### Admin

Admin routes are protected by the application's admin route guard.

- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/orders/:id` - Admin order details

## State Management

The frontend uses Zustand stores for application state, including:

- Authentication
- Cart
- Wishlist
- Recently viewed products

Authentication initialization runs before the React application is rendered, allowing the frontend to restore the current authentication state when the application starts.

## API Layer

API communication is separated into service modules under `src/services/`.

Current service modules include:

- `api.js`
- `authService.js`
- `productService.js`
- `categoryService.js`
- `cartService.js`
- `orderService.js`
- `addressService.js`
- `paymentService.js`
- `reviewService.js`
- `orderCleanupService.js`

The API base URL is configured through the Vite environment variable `VITE_API_URL`.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real production secrets or private credentials to the repository.

## Getting Started

### 1. Requirements

Use a current Node.js version compatible with the installed Vite/React toolchain.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

Update the value when the backend is deployed.

### 4. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

### 5. Run the production build

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

### 7. Run linting

```bash
npm run lint
```

## Backend Requirement

This repository contains the frontend. It expects a compatible backend API to be running at the URL configured in `VITE_API_URL`.

For local development, the current configuration points to:

```text
http://localhost:5000/api
```

The backend is responsible for server-side functionality such as authentication, products, categories, cart data, orders, addresses, reviews, payments, and other persistent application data.

## Authentication

The frontend includes authentication-aware state and protected admin navigation.

The application initializes authentication before rendering and uses a dedicated Zustand authentication store. Customer account/order functionality and admin functionality depend on the backend authentication system being available.

## Styling and UI

The application uses Tailwind CSS together with project-specific style utilities.

The Vite configuration includes the React plugin and Tailwind CSS Vite integration.

Theme handling supports light and dark modes. The initial theme is restored from local storage when available, otherwise the user's system preference is used.

## Error Handling

The frontend includes:

- An application-level error boundary
- Toast notifications for user feedback
- Protected admin routes
- Loading and empty states within feature pages
- A fallback 404 route

## Development Guidelines

When adding a new feature:

1. Put route-level screens in `src/pages/`.
2. Put reusable UI in `src/components/`.
3. Put API calls in `src/services/`.
4. Put reusable state in `src/store/`.
5. Put reusable behavior in `src/hooks/`.
6. Keep static configuration/data in `src/constants/` or `src/data/`.
7. Avoid putting API calls directly inside reusable presentational components when a service module can own that responsibility.
8. Run `npm run lint` before committing.
9. Run `npm run build` to verify that the production build succeeds.

## Available Scripts

```bash
npm run dev       # Start Vite development server
npm run build     # Create production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Deployment Notes

For a production deployment:

1. Build the frontend with `npm run build`.
2. Deploy the generated `dist/` directory to a static hosting provider.
3. Configure the production `VITE_API_URL` environment variable.
4. Make sure the backend allows requests from the deployed frontend origin.
5. Configure SPA fallback/rewrites so client-side routes such as `/products` and `/account` resolve to `index.html`.

The frontend can be deployed separately from the backend.

## Environment Variables

### `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### `.env.example`

Commit a `.env.example` file containing placeholder configuration, but keep real `.env` files out of version control.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

## Portfolio Notes

This frontend demonstrates a production-style separation between:

- UI components
- Route pages
- Layouts
- State management
- API/service modules
- Reusable hooks
- Authentication
- Admin functionality
- Form handling
- Responsive styling
- Error handling

It is intended to be used with the project's compatible backend for a complete full-stack e-commerce application.

## License

Add your preferred license here before publishing the repository publicly.
