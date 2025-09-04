# Question & Answer API Server

A RESTful API server built with Express.js and PostgreSQL for managing questions and answers.

## Features

- **Question Management**: Create, read, update, delete, and search questions
- **Answer System**: Add answers to questions with character limit validation
- **Category Support**: Organize questions by categories
- **Search Functionality**: Search questions by title or category

## Database Schema

The API uses PostgreSQL with the following tables:
- `questions`: Stores question data (id, title, description, category)
- `answers`: Stores answers linked to questions (id, question_id, content)

## API Endpoints

### Questions

#### Create a new question
- **POST** `/questions`
- **Body**: `{"title": "string", "description": "string", "category": "string"}`
- **Success**: `201 Created` - `{"message": "Question created successfully."}`
- **Error**: `400 Bad Request` - `{"message": "Invalid request data."}`

#### Get all questions
- **GET** `/questions`
- **Success**: `200 OK` - `{"data": [question objects]}`
- **Error**: `500 Internal Server Error` - `{"message": "Unable to fetch questions."}`

#### Get question by ID
- **GET** `/questions/:questionId`
- **Success**: `200 OK` - `{"data": question object}`
- **Error**: `404 Not Found` - `{"message": "Question not found."}`

#### Update question
- **PUT** `/questions/:questionId`
- **Body**: `{"title": "string", "description": "string", "category": "string"}`
- **Success**: `200 OK` - `{"message": "Question updated successfully."}`
- **Error**: `400 Bad Request` - `{"message": "Invalid request data."}`

#### Delete question
- **DELETE** `/questions/:questionId`
- **Success**: `200 OK` - `{"message": "Question post has been deleted successfully."}`
- **Error**: `404 Not Found` - `{"message": "Question not found."}`

#### Search questions
- **GET** `/questions/search?title=string&category=string`
- **Success**: `200 OK` - `{"data": [matching questions]}`
- **Error**: `400 Bad Request` - `{"message": "Invalid search parameters."}`

### Answers

#### Create answer for question
- **POST** `/questions/:questionId/answers`
- **Body**: `{"content": "string"}` (max 300 characters)
- **Success**: `201 Created` - `{"message": "Answer created successfully."}`
- **Error**: `400 Bad Request` - `{"message": "Invalid request data."}`

#### Get answers for question
- **GET** `/questions/:questionId/answers`
- **Success**: `200 OK` - `{"data": [answer objects]}`
- **Error**: `404 Not Found` - `{"message": "Question not found."}`

#### Delete all answers for question
- **DELETE** `/questions/:questionId/answers`
- **Success**: `200 OK` - `{"message": "All answers for the question have been deleted successfully."}`
- **Error**: `404 Not Found` - `{"message": "Question not found."}`

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Configure PostgreSQL database connection in `utils/db.mjs`

3. Run the server:
```bash
npm start
```

The server will run on `http://localhost:4000`

## Project Structure

```
├── app.mjs                 # Main application file
├── routes/
│   ├── questions.mjs      # Question management routes
│   └── answers.mjs        # Answer management routes
├── utils/
│   └── db.mjs             # Database connection
└── package.json           # Dependencies and scripts
```

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes and descriptive error messages. The API validates input data and provides meaningful feedback for various error scenarios.
