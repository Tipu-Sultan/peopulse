# friendfy

# Social Media Web Application

A modern, feature-rich social media web application built using **Next.js**. This application provides a platform for users to connect, share posts, interact with others, and manage profiles seamlessly.

## Features

- **User Authentication:**
  - Sign up and log in with secure authentication using JWT or OAuth.
  - Role-based access control for admins and users.

- **User Profiles:**
  - Create and update user profiles, including profile pictures, bios, and more.
  - View other users' profiles.

- **Post Management:**
  - Create, edit, and delete posts.
  - Upload media (images and videos) using integrated Cloudinary support.

- **Social Interactions:**
  - Like, comment, and share posts.
  - Follow and unfollow other users.

- **Real-Time Updates:**
  - Real-time notifications for likes, comments, and follows using Socket.IO.

- **Responsive Design:**
  - Fully responsive and mobile-friendly UI built with Tailwind CSS.

## Tech Stack

### Frontend
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **State Management:** Context API / Redux Toolkit

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Storage:** Cloudinary for media storage
- **Real-Time Communication:** Socket.IO

### Additional Tools
- **Deployment:** Vercel (frontend) and Railway (backend)
- **Authentication:** JSON Web Tokens (JWT) or OAuth
- **Version Control:** Git and GitHub

## Installation and Setup

### Prerequisites
- Node.js (>=16.x)
- MongoDB database instance

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tipu-Sultan/friendfy.git
   cd friendfy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```


3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Folder Structure

```
📦 friendfy
├── 📂 app            # Next.js app folder for pages
├── 📂 components     # Reusable React components
├── 📂 pages          # API routes and server-side pages
├── 📂 public         # Static files (images, icons, etc.)
├── 📂 styles         # Global CSS and Tailwind CSS files
├── 📂 utils          # Utility functions and helpers
├── 📂 models         # Database models
├── 📂 middleware     # Authentication and middleware logic
└── .env.local        # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/verify`: User Verify


### Posts
- `GET /api/posts`: Fetch all posts
- `POST /api/posts`: Create a new post
- `PUT /api/posts/:id`: Update a post
- `DELETE /api/posts/:id`: Delete a post

### Users
- `GET /api/users`: Fetch all users
- `GET /api/users/:id`: Fetch user details
- `PUT /api/users/:id`: Update user profile
- `DELETE /api/users/:id`: Delete a user

### Comments
- `POST /api/comments`: Add a comment to a post
- `DELETE /api/comments/:id`: Delete a comment

## Deployment

1. **Deployment:**
   - Deploy the this project on  Vercel.



---

### Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Socket.IO](https://socket.io/)
