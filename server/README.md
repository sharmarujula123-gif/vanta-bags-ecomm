# Vanta Bags Backend

REST API backend for the Vanta Bags e-commerce application.

The backend is built with Node.js and Express and uses MongoDB through Mongoose. It provides the server-side functionality required by the Vanta Bags frontend, including authentication, products, categories, cart, orders, addresses, reviews, payments, image uploads, and admin operations.

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API server |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Razorpay | Payment integration |
| Cloudinary | Image/media storage |
| Multer | Multipart file uploads |
| Zod | Request/data validation |
| Helmet | HTTP security headers |
| CORS | Cross-origin API access |
| express-rate-limit | API rate limiting |
| cookie-parser | Cookie handling |
| slugify | URL-friendly product/category slugs |
| Vitest | Automated testing |
| Supertest | HTTP API testing |
| Nodemon | Development server reloads |

These dependencies and development tools are defined in the backend package configuration. fileciteturn5file13L746-L781

## Project Architecture

The backend follows a layered REST API architecture:

```text
Client / Frontend
       │
       ▼
   Express API
       │
       ├── Routes
       │      │
       │      ▼
       ├── Controllers
       │      │
       │      ▼
       ├── Services / Utilities
       │      │
       │      ├── Authentication
       │      ├── Payments
       │      ├── Cloudinary
       │      └── Validation
       │
       ▼
    Mongoose
       │
       ▼
    MongoDB
```

Keep business logic in the appropriate controller/service layer rather than putting large amounts of application logic directly inside route definitions.

## Main Backend Responsibilities

### Authentication

- User registration
- User login
- Password hashing
- JWT-based authentication
- Access/refresh token handling
- Protected customer routes
- Protected admin functionality

JWT and bcryptjs are included as backend dependencies. fileciteturn5file13L762-L776

### Products

The API supports product-related operations required by the storefront and admin dashboard, including product retrieval and management.

### Categories

Categories are exposed through the API so the frontend can build category collections and filtering/navigation.

### Cart

The backend provides persistent cart functionality for authenticated customers.

### Orders

The API handles order creation, retrieval, customer order history, and administrative order management.

### Addresses

Customer shipping/billing address data can be stored and retrieved through the backend.

### Reviews

Product review functionality is handled server-side so review data can be persisted and associated with products/users.

### Payments

The backend integrates Razorpay for payment processing. Razorpay is included in the project dependencies. fileciteturn5file14L821-L828

### Image Uploads

Multer handles incoming multipart uploads and Cloudinary is used for cloud media storage. fileciteturn5file13L762-L775

## Security

The backend includes several production-oriented security components:

- JWT authentication
- Password hashing with bcryptjs
- Helmet security headers
- CORS configuration
- Express rate limiting
- Environment-based secrets
- Request validation with Zod

Helmet and express-rate-limit are part of the installed backend dependencies. fileciteturn5file13L768-L776

## Environment Variables

Create a `.env` file in the backend root.

Use placeholders locally and provide real credentials only through your local environment or your deployment provider's environment-variable settings.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5174

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development

PAYMENT_MODE=razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

The current project environment configuration uses port `5000`, a MongoDB connection, a frontend client URL, JWT secrets, Razorpay, Cloudinary, and development/payment settings. Real credentials should **never** be committed to GitHub. fileciteturn5file0L11-L26

## Installation

From the backend directory:

```bash
npm install
```

## Development

Start the backend with:

```bash
npm run dev
```

The configured development script starts:

```text
nodemon src/server.js
```

The production/start script is:

```bash
npm start
```

which runs:

```text
node src/server.js
```

These scripts are defined in `package.json`. fileciteturn5file13L751-L756

## Testing

Run the test suite once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The project uses Vitest, with a test setup file configured through `vitest.config.js`. fileciteturn5file8L513-L519

Supertest is also included for HTTP/API testing. fileciteturn5file13L778-L781

## Database Seeding

The backend includes a seed command:

```bash
npm run seed
```

which runs:

```text
node src/seed/seed.js
```

Use this when you want to populate the development database with the project's seed data. fileciteturn5file13L751-L756

## Frontend Connection

The frontend should point its API client to the deployed backend URL.

For local development:

```text
Frontend → http://localhost:5000/api
```

The backend uses `CLIENT_URL` to identify the allowed frontend origin.

When deploying, update the frontend API URL and backend `CLIENT_URL` to the appropriate production URLs.

## Production Deployment Checklist

Before deployment:

- [ ] Create a production MongoDB database
- [ ] Set a strong `JWT_ACCESS_SECRET`
- [ ] Set a strong `JWT_REFRESH_SECRET`
- [ ] Configure the production `CLIENT_URL`
- [ ] Configure Razorpay production credentials if real payments are enabled
- [ ] Configure Cloudinary credentials
- [ ] Set `NODE_ENV=production`
- [ ] Do not commit `.env`
- [ ] Configure CORS for the deployed frontend only
- [ ] Verify rate limiting
- [ ] Run the test suite
- [ ] Test the production API from the deployed frontend

## Important Security Note

If credentials have ever been committed to GitHub or shared publicly, rotate them.

Never place these values directly in source code:

```text
MONGO_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
RAZORPAY_KEY_SECRET
CLOUDINARY_API_SECRET
```

Use environment variables instead.

## Available Scripts

```bash
npm run dev          # Development server with Nodemon
npm start            # Start production server
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run seed         # Seed the database
```

## API Documentation

A separate Swagger/OpenAPI document is not currently required for this portfolio project.

If the API grows substantially, adding an OpenAPI/Swagger specification would be a useful next documentation upgrade.

## Recommended Repository Files

For the backend repository, keep:

```text
README.md
.env.example
.gitignore
package.json
package-lock.json
src/
```

Do not commit:

```text
.env
node_modules/
coverage/
logs/
```

## Full-Stack Relationship

The Vanta Bags application is split into two deployable parts:

```text
Vanta Bags
│
├── Frontend
│   └── React + Vite
│
└── Backend
    └── Node.js + Express + MongoDB
```

The frontend consumes the backend REST API, while the backend owns authentication, persistent data, payments, media uploads, and business logic.

## Portfolio Summary

This backend demonstrates a practical full-stack e-commerce API architecture with:

- RESTful API design
- MongoDB/Mongoose persistence
- JWT authentication
- Password hashing
- Customer and admin flows
- Product/category management
- Cart and order processing
- Payment integration
- Cloud image uploads
- Validation
- Security middleware
- Rate limiting
- Automated testing
- Database seeding

It is suitable as the backend component of a junior-to-intermediate full-stack portfolio project.
