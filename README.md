# Blog App

## Version 1.0.0

A simple project for my portfolio using the fullstack with Nodejs ExpressJS PostgreSQL and React js, currently at version 1.0.0. The search and change mode features have not been added yet (currently only dark mode is available). Other features like responsiveness, post categories, and others are already implemented. This web application is designed to help users manage and share their photo collections, providing an intuitive and user-friendly platform where users can easily upload, view, and manage their photos.

## Features

- **User Authentication**: User registration, login (including login with Google), and logout.
- **Photo Collection Management**: Upload, delete, and edit photos.
- **Photo Categories**: Categorize photos based on various tags.
- **Like**: Users can like photos.
- **Filter**: Filter photos by category (search by query is not available).
- **User Profile**: Personal information of the user.
- **Responsive Design**: Responsive design for various screen sizes.
- **CRUD Operations**: Users can perform Create, Read, Update, and Delete (CRUD) operations on users, posts, comments, and likes.

## Prerequisites

Make sure you have the following prerequisites installed:

- **Node.js**: Version 18 or later
- **npm**: Version 8 or later (included with Node.js).
- **PostgreSQL**: A running instance of PostgreSQL.

## Installation

Follow these steps to install the project:

1. Clone this repository:

   ```bash
   git clone https://github.com/username/blog-app.git
   cd blog-app
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Configure environment variables:
   Create a .env.example file in the root directory with the following configurations:

   ```env
   PORT=4000
   DATABASE_URL=postgresql://user:password@localhost:5432/myawesomeproject
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Rename .env.example to .env and update the values accordingly.

5. Run the server:
   ```bash
   yarn dev # for backend
   yarn clientDev # for client
   ```

## Usage

After running the server, open your browser and access `http://localhost:4000`. You can:

- Create an account (including login with Google)
- Upload photos
- Like photos
- Filter photos by category

## License

This project is licensed under the MIT License.

This README.md file provides an updated overview of the project, including the use of PostgreSQL, the Express.js backend, the React.js frontend, and the ability to login with Google. The instructions for setting up and running the project are also updated accordingly.
