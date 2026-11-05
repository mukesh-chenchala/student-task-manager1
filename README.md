# Student Task Manager

A full-stack MERN application that helps students manage their daily tasks, track progress, and stay organized.

## About the Project

Student Task Manager is a web application where students can register, log in, and manage their personal tasks. Each student has a separate task list, ensuring that their tasks remain private to their account.

## Features

- Student registration and login
- Secure authentication using JWT
- Add new tasks
- Edit existing tasks
- Delete tasks
- Update task status
- Search and filter tasks
- Individual task lists for each student
- Logout functionality

## Technologies Used

**Frontend**
- React.js
- HTML
- CSS
- JavaScript
- Axios
- React Router
- Vite

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
student-task-manager/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/vu241fa04991-jpg/student-task-manager.git
```

### 2. Open the project folder

```bash
cd student-task-manager
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder. Add the MongoDB connection variable expected by your backend code and configure:

```env
JWT_SECRET=your_secret_key
```

Do not upload your actual `.env` file or database credentials to GitHub.

### 5. Start the backend

```bash
npm run dev
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd student-task-manager/frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

Open the local URL displayed in your frontend terminal.

## Project Purpose

The purpose of this project is to provide students with a simple and organized platform to manage their tasks and improve productivity.

## Author

**GitHub:** [vu241fa04991-jpg](https://github.com/vu241fa04991-jpg)
