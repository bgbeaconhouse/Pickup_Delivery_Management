Pickup & Delivery Management System
A full-stack web application for managing pickup and delivery services with secure authentication, image processing, and real-time data management.

📋 Features

User Authentication - Secure login/registration with JWT tokens
Pickup Management - Create, view, edit, and delete pickup requests
Delivery Management - Full CRUD operations for delivery tracking
Image Upload - Multi-image support with automatic thumbnail generation
Responsive Design - Optimized for desktop and mobile devices
Real-time Validation - Form validation with error handling
Performance Optimization - Lazy loading for images and optimized API calls

🛠️ Tech Stack
Frontend

React.js - Component-based UI framework
React Router DOM - Client-side routing and navigation
Vite - Fast build tool and development server
React Lazy Load Image Component - Performance optimization
CSS3 - Custom styling and responsive design

Backend

Node.js - JavaScript runtime environment
Express.js - Web application framework
PostgreSQL - Relational database
Prisma ORM - Database toolkit and query builder
JWT - JSON Web Tokens for authentication
bcrypt - Password hashing
Multer - File upload middleware
Sharp - Image processing and optimization
Morgan - HTTP request logging
CORS - Cross-origin resource sharing

📊 Database Schema
Models

User - Authentication and user management
Pickup - Pickup request records with images
Delivery - Delivery tracking with customer information

Key Features

Automatic image resizing and thumbnail generation
Secure file storage with organized directory structure
Date handling for pickup/delivery scheduling

🔐 API Endpoints
Authentication

POST /api/register - User registration
POST /api/login - User login

Pickups

GET /api/pickups - Get all pickups
GET /api/pickups/:id - Get single pickup
POST /api/pickups - Create new pickup
PUT /api/pickups/:id - Update pickup
DELETE /api/pickups/:id - Delete pickup

Deliveries

GET /api/deliveries - Get all deliveries
GET /api/deliveries/:id - Get single delivery
POST /api/deliveries - Create new delivery
PUT /api/deliveries/:id - Update delivery
DELETE /api/deliveries/:id - Delete delivery

🖼️ Image Processing

Automatic Resizing - Images resized to 800px width for display
Thumbnail Generation - 200px thumbnails created automatically
Multiple Upload Support - Up to 10 images per request
Format Optimization - Sharp library handles various image formats

🔒 Security Features

JWT token-based authentication
Password hashing with bcrypt
Protected routes with middleware verification
CORS configuration for secure cross-origin requests
Input validation and error handling

🚀 Deployment
The application is deployed on Render with:

Automatic builds from GitHub
Environment variable management
Static file serving for the React frontend
PostgreSQL database hosting
