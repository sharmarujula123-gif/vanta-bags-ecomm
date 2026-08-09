Vanta Bags API

Base URL:

http://localhost:5000

Authentication

Authentication uses JWT tokens stored in HTTP-only cookies.

Register

POST /api/auth/register

Creates a new customer account.

Request body:

{
  "name": "Mohit Test",
  "email": "mohit.test@example.com",
  "password": "Password123"
}

Success response:

{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Mohit Test",
      "email": "mohit.test@example.com",
      "role": "customer"
    }
  }
}

Login

POST /api/auth/login

Authenticates a user and sets the accessToken and refreshToken HTTP-only cookies.

Request body:

{
  "email": "mohit.test@example.com",
  "password": "Password123"
}

Success response:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "Mohit Test",
      "email": "mohit.test@example.com",
      "role": "customer"
    }
  }
}

Get Current User

GET /api/auth/me

Requires authentication.

Returns the currently authenticated user.

Refresh Access Token

POST /api/auth/refresh

Uses the refresh-token cookie to issue a new access token.

Logout

POST /api/auth/logout

Clears the authentication cookies.

Categories

Get All Categories

GET /api/categories

Public endpoint.

Get Category by Slug

GET /api/categories/:slug

Public endpoint.

Create Category

POST /api/categories

Requires authentication and admin role.

Products

Get Products

GET /api/products

Public product listing endpoint.

Get Product

GET /api/products/:id

Public endpoint.

Create Product

POST /api/products

Requires authentication and admin role.

Update Product

PATCH /api/products/:id

Requires authentication and admin role.

Delete Product

DELETE /api/products/:id

Requires authentication and admin role.

Cart

Get Cart

GET /api/cart

Requires authentication.

Add Item to Cart

POST /api/cart/items

Requires authentication.

Update Cart Item

PATCH /api/cart/items/:productId

Requires authentication.

Remove Cart Item

DELETE /api/cart/items/:productId

Requires authentication.

Orders

Create Order

POST /api/orders

Requires authentication.

Get My Orders

GET /api/orders

Requires authentication.

Get Order by ID

GET /api/orders/:id

Requires authentication.

Cancel My Order

PATCH /api/orders/:id/cancel

Requires authentication.

Get All Orders

GET /api/orders/admin/all

Requires authentication and admin role.

Get Admin Order

GET /api/orders/admin/:id

Requires authentication and admin role.

Update Order Status

PATCH /api/orders/admin/:id/status

Requires authentication and admin role.

Payments

Create Payment

POST /api/payments/create

Requires authentication.

Verify Payment

POST /api/payments/verify

Requires authentication.

Razorpay Webhook

POST /api/payments/webhook

Used by Razorpay to send payment events to the backend.

Common Error Response

{
  "success": false,
  "message": "Error message"
}

Authentication

Protected endpoints use the JWT authentication cookies created during login.

Admin endpoints additionally require the authenticated user's role to be admin.