# Restaurant Management API

A RESTful Restaurant Management API built with Node.js, Express, MongoDB, and Mongoose. The API supports user authentication, restaurant CRUD operations, and menu item management.

## Live API

https://restaurant-management-api-frxx.onrender.com

## Features

- User registration and login
- Password hashing with bcryptjs
- JWT-based authentication
- Restaurant CRUD operations
- Menu item CRUD operations
- Restaurant-menu relationships using MongoDB ObjectIds
- Input validation
- MongoDB database integration

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and generate JWT |

### Restaurants

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get API welcome message |
| GET | `/:id` | Get restaurant by ID |
| POST | `/` | Create a restaurant |
| PUT | `/:id` | Update a restaurant |
| DELETE | `/:id` | Delete a restaurant |

### Menu

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:restaurantId/menu` | Get restaurant menu |
| POST | `/:restaurantId/menu` | Create a menu item |
| PUT | `/:restaurantId/menu/:id` | Update a menu item |
| DELETE | `/:restaurantId/menu/:id` | Delete a menu item |

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- JSON Web Token (JWT)

## Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <project-directory>
2. Install dependencies
npm install
3. Create .env

Create a .env file in the project root:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4. Start the server
npm start

The API will run locally on:

http://localhost:3000
Example Requests
Register
POST /register
Content-Type: application/json
{
  "username": "ajit",
  "email": "ajit@gmail.com",
  "password": "password123"
}
Login
POST /login
Content-Type: application/json
{
  "email": "ajit@gmail.com",
  "password": "password123"
}
Create Restaurant
POST /
Content-Type: application/json
{
  "name": "Spice Garden",
  "city": "Mumbai",
  "address": "Diva",
  "cuisine": "Indian",
  "rating": 4.5
}
Create Menu Item
POST /:restaurantId/menu
Content-Type: application/json
{
  "name": "Paneer Tikka",
  "price": 250,
  "isAvailable": true
}

The restaurantId is taken from the restaurant's MongoDB _id.

Project Structure
project/
├── config/
│   └── db.js
├── models/
│   ├── Restaurants.js
│   ├── Menu_items.js
│   └── Users.js
├── routes/
│   └── restaurants.js
├── .env
├── .gitignore
├── package.json
└── server.js
Database Relationship

Menu items are linked to restaurants using the restaurant's MongoDB ObjectId.

Restaurant
    │
    │ _id
    ↓
Menu Item
    │
    └── restaurant: Restaurant ObjectId

For example:

POST /restaurants/64abc123/menu

The 64abc123 ID identifies the restaurant to which the menu item belongs.

Deployment

The API is deployed on Render.

Live URL:

https://restaurant-management-api-frxx.onrender.com

Author

Built as a Restaurant Management API project using Node.js, Express, and MongoDB.