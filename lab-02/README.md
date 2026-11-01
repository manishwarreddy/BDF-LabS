# BDF Lab 02: SQLite Database and Express CRUD API

## Student Information

- **Student Name:** A. Manishwar Reddy
- **Registration Number:** 252U1R5011
- **Section:** CSE 1A (AI & DE)
- **Course:** Backend Development Frameworks (BDF)
- **Lab Number:** 02
- **GitHub Repository:** [https://github.com/manishwarreddy/BDF-LabS](https://github.com/manishwarreddy/BDF-LabS)

---

## 1. Project Overview

This project implements a complete, database-driven RESTful API using **Node.js**, **Express.js**, and an embedded **SQLite** database (`books.db`). 

Key learning objectives achieved:
1. Connecting Node.js to an embedded SQLite database using `sqlite3` and the promise-based `sqlite` wrapper.
2. Managing the asynchronous lifecycle with `initializeDBAndServer()`, ensuring database readiness before binding to the network port.
3. Implementing full **CRUD** (Create, Read, Update, Delete) routes for a `book` resource.
4. Securing database interactions using **parameterized SQL queries (`?`)** to protect against SQL Injection attacks.
5. Preparing and documenting comprehensive API endpoints for testing via Postman and `curl`.

---

## 2. Database Schema & Sample Records

The SQLite database file `books.db` was initialized directly using the SQLite CLI and contains the `book` table:

### Table Schema: `book`

```sql
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL,
  pages INTEGER NOT NULL
);
```

### Initial Data Inserted via SQLite CLI (10 Sample Records)

The following 10 book records were inserted into `books.db`:

```sql
INSERT INTO book (title, author, price, pages) VALUES 
('Clean Code', 'Robert C. Martin', 450.0, 464),
('The Pragmatic Programmer', 'Andrew Hunt and David Thomas', 520.0, 352),
('JavaScript: The Good Parts', 'Douglas Crockford', 350.0, 176),
('You Don''t Know JS', 'Kyle Simpson', 299.0, 278),
('Design Patterns', 'Erich Gamma et al.', 650.0, 395),
('Refactoring', 'Martin Fowler', 580.0, 448),
('Introduction to Algorithms', 'Thomas H. Cormen', 890.0, 1312),
('Structure and Interpretation of Computer Programs', 'Harold Abelson', 720.0, 657),
('Head First Design Patterns', 'Eric Freeman', 480.0, 694),
('Cracking the Coding Interview', 'Gayle Laakmann McDowell', 550.0, 687);
```

> **Note on `books.db`:** The database file is included directly in this repository so that the project can be cloned and tested immediately with pre-existing records.

---

## 3. Project Structure

```text
lab-02/
├── books.db            # Pre-populated SQLite database with 10 sample books
├── server.js           # Express app, initializeDBAndServer & CRUD routes
├── package.json        # Dependencies (express, sqlite, sqlite3, nodemon)
├── package-lock.json   # Lockfile for reproducible installs
├── .gitignore          # Excludes node_modules/, *.log, .env
├── screenshots/        # Postman test screenshots for lab evaluation
│   └── README.md       # Guidelines on required screenshots
└── README.md           # Lab documentation & Postman testing guide
```

---

## 4. Package Configuration (`package.json`)

The project uses the following dependencies:

| Package | Type | Purpose |
|---|---|---|
| `express` | Production | Minimalist web application framework for handling routes and HTTP requests. |
| `sqlite3` | Production | Low-level C++ SQLite driver for Node.js. |
| `sqlite` | Production | Modern Promise-based abstraction wrapper over `sqlite3` enabling clean `async/await` syntax. |
| `nodemon` | Dev Dependency | Development utility that automatically monitors for file changes and restarts the server. |

### Scripts:
- `npm start`: Runs the server with Node.js (`node server.js`).
- `npm run dev`: Runs the server with live reload via Nodemon (`nodemon server.js`).

---

## 5. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later installed)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Quick Start:
1. Open your terminal and navigate to `lab-02`:
   ```bash
   cd lab-02
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # or with live reloading:
   npm run dev
   ```
- **Terminal Output:** `Server Running at http://localhost:3000/`

---

## 6. CRUD API Documentation

All request bodies must be sent as `Content-Type: application/json`.

| Operation | Method | Endpoint | Status Code | SQLite Method | Description |
|---|---|---|---|---|---|
| **Read All** | `GET` | `/books/` | `200 OK` | `db.all()` | Returns JSON array of all book records. |
| **Read One** | `GET` | `/books/:bookId/` | `200 OK` / `404` | `db.get()` | Returns a single book object matching `:bookId`. |
| **Create** | `POST` | `/books/` | `201 Created` / `400` | `db.run()` | Inserts a new book; returns new `bookId`. |
| **Update** | `PUT` | `/books/:bookId/` | `200 OK` / `404` | `db.run()` | Updates book details matching `:bookId`. |
| **Delete** | `DELETE` | `/books/:bookId/` | `200 OK` / `404` | `db.run()` | Deletes book record matching `:bookId`. |

---

### Detailed Request / Response Samples

#### 1. GET `/books/` (Retrieve All Books)
- **Request:**
  ```bash
  curl http://localhost:3000/books/
  ```
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "price": 450,
      "pages": 464
    },
    {
      "id": 2,
      "title": "The Pragmatic Programmer",
      "author": "Andrew Hunt and David Thomas",
      "price": 520,
      "pages": 352
    }
  ]
  ```

#### 2. GET `/books/:bookId/` (Retrieve Single Book)
- **Request:**
  ```bash
  curl http://localhost:3000/books/1/
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 450,
    "pages": 464
  }
  ```

#### 3. POST `/books/` (Add New Book)
- **Request:**
  ```bash
  curl -X POST http://localhost:3000/books/ \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"The Mythical Man-Month\",\"author\":\"Fred Brooks\",\"price\":420.0,\"pages\":322}"
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "Book Added Successfully",
    "bookId": 11
  }
  ```

#### 4. PUT `/books/:bookId/` (Update Existing Book)
- **Request:**
  ```bash
  curl -X PUT http://localhost:3000/books/1/ \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Clean Code (2nd Edition)\",\"price\":499.0}"
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Book Details Updated Successfully"
  }
  ```

#### 5. DELETE `/books/:bookId/` (Delete Book)
- **Request:**
  ```bash
  curl -X DELETE http://localhost:3000/books/11/
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Book Deleted Successfully"
  }
  ```

---

## 7. Security: Parameterized SQL Queries

In all routes that accept client input (e.g., `:bookId` in URL parameters or `title`, `author`, `price`, `pages` in `req.body`), we use **parameterized queries with `?` placeholders**:

```javascript
// SECURE: Parameterized Query
const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
const book = await db.get(getBookQuery, [bookId]);
```

### Why is this important?
- **Prevents SQL Injection:** If we concatenated user inputs directly (e.g., ``WHERE id = ${bookId}``), a malicious user could pass `'1; DROP TABLE book;'` and execute unauthorized SQL.
- **Data Type Safety:** The database driver treats all inputs within the parameters array strictly as literal values, safely escaping special characters.

---

## 8. Postman Collection & Automated Testing

A complete Postman collection is included in this repository at [`lab-02/BDF-Lab-02.postman_collection.json`](BDF-Lab-02.postman_collection.json).

### Automated Postman Collection Run (Newman)
All 5 requests and 10 test assertions were executed and verified against the running server:

```text
BDF Lab 02 - SQLite & Express CRUD API

→ 1. GET All Books
  GET http://localhost:3000/books/ [200 OK, 1.2kB]
  √  Status code is 200 OK
  √  Response is an array of books

→ 2. GET Single Book by ID
  GET http://localhost:3000/books/1/ [200 OK, 316B]
  √  Status code is 200 OK
  √  Response contains valid book details

→ 3. POST Add New Book
  POST http://localhost:3000/books/ [201 Created, 289B]
  √  Status code is 201 Created
  √  Response confirms book addition and returns bookId

→ 4. PUT Update Book Details
  PUT http://localhost:3000/books/12/ [200 OK, 282B]
  √  Status code is 200 OK
  √  Response confirms book update

→ 5. DELETE Book by ID
  DELETE http://localhost:3000/books/12/ [200 OK, 274B]
  √  Status code is 200 OK
  √  Response confirms book deletion

Iterations: 1/1 | Requests: 5/5 | Assertions: 10/10 passed (0 failed)
```

---

## 9. Verification Screenshots

The verified Postman screenshots are stored in the [`screenshots/`](screenshots/) directory:

### 9.1 GET All Books (`GET /books/`)
![GET All Books](screenshots/01-get-all-books.png)
*Description: Postman response showing HTTP 200 OK and JSON array of all books.*

### 9.2 GET Single Book by ID (`GET /books/1/`)
![GET Single Book](screenshots/02-get-single-book.png)
*Description: Postman response showing HTTP 200 OK and single book record for `:bookId = 1`.*

### 9.3 POST Add New Book (`POST /books/`)
![POST Add Book](screenshots/03-post-create-book.png)
*Description: Postman response showing HTTP 201 Created and newly generated `bookId`.*

### 9.4 PUT Update Book Details (`PUT /books/1/`)
![PUT Update Book](screenshots/04-put-update-book.png)
*Description: Postman response showing HTTP 200 OK and confirmation of updated book details.*

### 9.5 DELETE Book by ID (`DELETE /books/11/`)
![DELETE Book](screenshots/05-delete-book.png)
*Description: Postman response showing HTTP 200 OK and confirmation of deleted book.*

---

## 10. Technical Viva Q&A

1. **What is the difference between `sqlite3` and `sqlite` npm packages?**  
   `sqlite3` is the low-level native driver that uses callback functions (`db.all(query, (err, rows) => { ... })`). `sqlite` is a modern Promise-based wrapper around `sqlite3` that enables clean `async/await` syntax without callback hell.

2. **Why must `initializeDBAndServer()` be an asynchronous function?**  
   Connecting to the SQLite database on disk (`open()`) is an asynchronous I/O operation. If the server began listening immediately before the database connection resolved, early incoming API requests would attempt queries on an uninitialized (`null`) database instance and crash the server.

3. **What is the difference between `db.all()`, `db.get()`, and `db.run()`?**  
   - `db.all()`: Executes a `SELECT` query and returns an **array** of all matching row objects.
   - `db.get()`: Executes a `SELECT` query and returns only the **first** matching row object (or `undefined`).
   - `db.run()`: Executes non-query commands (`INSERT`, `UPDATE`, `DELETE`) and returns metadata like `lastID` and `changes`.

