# blog-app-mern
## Version 1.0.0

A simple project for my portfolio using the MERN stack, currently at version 1.0.0. The search, comments, follow, and change mode features have not been added yet (currently only dark mode is available). Other features like responsiveness, post categories, and others are already implemented. This web application is designed to help users manage and share their photo collections, providing an intuitive and user-friendly platform where users can easily upload, view, and manage their photos.

## Features

- **User Authentication**: User registration, login, and logout.
- **Photo Collection Management**: Upload, delete, and edit photos.
- **Photo Categories**: Categorize photos based on various tags.
- **Like**: Users can like photos.
- **Filter**: Filter photos by category.
- **User Profile**: Personal information of the user.
- **Responsive Design**: Responsive design for various screen sizes.

## Prerequisites

Make sure you have the following prerequisites installed:

- **Node.js**: Version 18 or later.
- **npm**: Version 8 or later (included with Node.js).
- **MongoDB**: A running instance of MongoDB.

## Installation

Follow these steps to install the project:

1. Clone this repository:
    ```bash
    git clone https://github.com/username/blog-app-mern.git
    cd blog-app-mern
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Configure environment variables:
    Create a `.env` file in the root directory and add the following configurations:
    ```env
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/myawesomeproject
    JWT_SECRET=your_jwt_secret
    ```

4. Run the server:
    ```bash
    yarn dev # for backend
    yarn clientDev # for client
    ```

## Usage

After running the server, open your browser and access `http://localhost:4000`. You can:

- Create an account
- Upload photos
- Like photos
- Use the search feature to find photos by category or tag

## Contributing

We welcome contributions from everyone! To contribute:

1. Fork this repository.
2. Create a new branch for your feature or fix (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add feature A'`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a Pull Request to this repository.

Make sure to follow the contribution guidelines and code of conduct available in `CONTRIBUTING.md`.

## License

This project is licensed under the MIT License.
