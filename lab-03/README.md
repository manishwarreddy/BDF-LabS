# BDF Lab 03: REST API with Query Parameters, Validation & Debugging

**Backend Development Fundamentals** · Year II Term II · Aurora  
**Faculty:** Joel Prashanth D  
**Student Name:** A. Manishwar Reddy  
**Registration Number:** 252U1R5011  
**Section:** CSE 1A (AI & DE)  
**Live Deployed API:** [https://lab-03-ruby.vercel.app](https://lab-03-ruby.vercel.app)
**GitHub Repository:** [https://github.com/manishwarreddy/BDF-LabS](https://github.com/manishwarreddy/BDF-LabS)

---

## 1. Project Objective

The objective of Lab 03 is to elevate the basic CRUD API from Lab 02 into an industry-standard **RESTful API** incorporating:
1. **Query Parameters:** Multi-parameter search (`search_q`), sorting (`order_by`, `order`), pagination (`limit`, `offset`), and price-range filtering (`min_price`, `max_price`).
2. **Security & Parameterized Queries:** Strict whitelisting of sort columns and directions; 100% parameterized SQL placeholders (`?`) to completely prevent SQL injection.
3. **Rigorous Input Validation:** Rejection of missing fields, malformed types, invalid price ranges, and unsupported parameters with descriptive `HTTP 400 Bad Request` JSON responses.
4. **Standardized HTTP Status Codes:** `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`.
5. **Practical Debugging Exercises:** Diagnosis and resolution of four frequent backend pitfalls: `EADDRINUSE` port conflict, incorrect module import paths, SQLite table-name typos, and missing `await` statements.
6. **Automated Testing & Evidence:** Comprehensive Postman collection covering both success and negative validation/failure test cases, executed and verified using **Newman** with standalone interactive HTML reporting.
7. **Production Cloud Deployment:** Serverless deployment on **Vercel** with cold-start SQLite database initialization.

---

## 2. Technologies Used

- **Runtime Environment:** [Node.js](https://nodejs.org/) (v24.x)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5.x)
- **Database:** [SQLite](https://www.sqlite.org/) (`books.db`)
- **Database Drivers:**
  - `sqlite3` (v5.1.7): Low-level native SQLite engine.
  - `sqlite` (v5.1.1): Promise-based async/await wrapper.
- **Testing & Quality Assurance:**
  - [Postman](https://www.postman.com/): REST API client collection.
  - [Newman](https://www.npmjs.com/package/newman): CLI test runner.
  - `newman-reporter-htmlextra`: Interactive visual HTML reporting dashboard.
- **Hosting & Serverless Platform:** [Vercel](https://vercel.com/)

---

## 3. Project Structure

```text
lab-03/
├── books.db                    # Pre-populated SQLite database with 10 sample books
├── server.js                   # Express application, validation middleware, and REST routes
├── package.json                # Dependencies, engines, and test scripts
├── package-lock.json           # Exact dependency lockfile
├── vercel.json                 # Vercel serverless functions configuration
├── .gitignore                  # Excludes node_modules/, .env, *.log, .vercel
├── BDF-Lab-03.postman_collection.json  # Comprehensive 18-test Postman collection
├── screenshots/                # Verification reports and test evidence
│   ├── Lab-03-API-Test-Report.html    # Standalone interactive Newman HTMLExtra report
│   ├── test-results.txt               # Plain text terminal test execution summary
│   └── README.md                      # Index of test results and endpoint mapping
└── README.md                   # Complete Lab 03 documentation & Viva guide
```

---

## 4. Database Schema & Sample Records

The application uses a persistent SQLite database table named `book`:

```sql
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price REAL NOT NULL,
  pages INTEGER NOT NULL
);
```

### Pre-Seeded Sample Records (10 Books)

| ID | Title | Author | Price (₹) | Pages |
|---|---|---|---|---|
| 1 | Clean Code | Robert C. Martin | 450.0 | 464 |
| 2 | The Pragmatic Programmer | Andrew Hunt and David Thomas | 520.0 | 352 |
| 3 | JavaScript: The Good Parts | Douglas Crockford | 350.0 | 176 |
| 4 | You Don't Know JS | Kyle Simpson | 299.0 | 278 |
| 5 | Design Patterns | Erich Gamma et al. | 650.0 | 395 |
| 6 | Refactoring | Martin Fowler | 580.0 | 448 |
| 7 | Introduction to Algorithms | Thomas H. Cormen | 890.0 | 1312 |
| 8 | Structure and Interpretation of Computer Programs | Harold Abelson | 720.0 | 657 |
| 9 | Head First Design Patterns | Eric Freeman | 480.0 | 694 |
| 10 | Cracking the Coding Interview | Gayle Laakmann McDowell | 550.0 | 687 |

---

## 5. REST API Endpoints & Query Parameters

### Root Endpoint
- **URL:** `GET /`
- **Description:** Returns API welcome message, student information, and available endpoint directory.
- **Status Code:** `200 OK`

---

### Endpoint 1: Search, Filter, Sort, and Paginate Books
- **URL:** `GET /books/`
- **Method:** `GET`
- **Description:** Retrieves books based on optional query parameters. All parameters have safe defaults and strict validation.

#### Supported Query Parameters

| Parameter | Type | Default | Description | Validation Rule |
|---|---|---|---|---|
| `search_q` | String | `""` (empty) | Case-insensitive partial title match using SQL `LIKE ?` | Sanitized and trimmed |
| `order_by` | String | `'id'` | Column to sort by | Whitelisted: `['id', 'title', 'author', 'price', 'pages']`. Rejects unauthorized columns with `400 Bad Request`. |
| `order` | String | `'ASC'` | Sort direction | Whitelisted: `['ASC', 'DESC']` (case-insensitive). Rejects invalid direction with `400 Bad Request`. |
| `limit` | Integer | `10` | Maximum number of records to return | Must be a positive integer (`> 0`). Rejects `<= 0` or non-integer with `400 Bad Request`. |
| `offset` | Integer | `0` | Number of records to skip | Must be a non-negative integer (`>= 0`). Rejects `< 0` or non-integer with `400 Bad Request`. |
| `min_price`| Number | `null` | Lower price threshold (`price >= ?`) | Must be a non-negative number (`>= 0`). Rejects `< 0` or non-numeric with `400 Bad Request`. |
| `max_price`| Number | `null` | Upper price threshold (`price <= ?`) | Must be a non-negative number (`>= 0`). Rejects `< 0` or non-numeric with `400 Bad Request`. |

> **Special Validation:** If both `min_price` and `max_price` are provided, `min_price <= max_price` is strictly enforced. Passing `min_price > max_price` triggers `400 Bad Request`.

---

### Endpoint 2: Get Single Book by ID
- **URL:** `GET /books/:bookId/`
- **Method:** `GET`
- **Path Parameter:** `bookId` (positive integer)
- **Response:**
  - `200 OK`: Single book JSON object.
  - `400 Bad Request`: `bookId` is not a positive integer.
  - `404 Not Found`: Book ID does not exist in the database (`{"error": "Book not found"}`).

---

### Endpoint 3: Create New Book
- **URL:** `POST /books/`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "title": "Designing Data-Intensive Applications",
    "author": "Martin Kleppmann",
    "price": 799.0,
    "pages": 616
  }
  ```
- **Validation Rules:**
  - `title`: Required, non-empty string.
  - `author`: Required, non-empty string.
  - `price`: Required, non-negative number (`typeof price === 'number'` and `>= 0`).
  - `pages`: Required, positive integer (`Number.isInteger(pages)` and `> 0`).
- **Response:**
  - `201 Created`:
    ```json
    {
      "message": "Book Added Successfully",
      "bookId": 11
    }
    ```
  - `400 Bad Request`: Validation failure message (e.g., `{"error": "Title is required and must be a non-empty string."}`).

---

### Endpoint 4: Update Book Details
- **URL:** `PUT /books/:bookId/`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Path Parameter:** `bookId` (positive integer)
- **Request Body (partial or full update):**
  ```json
  {
    "title": "Clean Architecture (Second Edition)",
    "price": 650.0
  }
  ```
- **Response:**
  - `200 OK`: `{"message": "Book Details Updated Successfully"}`
  - `400 Bad Request`: Invalid body field types.
  - `404 Not Found`: `{"error": "Book not found"}` if `bookId` does not exist.

---

### Endpoint 5: Delete Book by ID
- **URL:** `DELETE /books/:bookId/`
- **Method:** `DELETE`
- **Path Parameter:** `bookId` (positive integer)
- **Response:**
  - `200 OK`: `{"message": "Book Deleted Successfully"}`
  - `404 Not Found`: `{"error": "Book not found"}` if `bookId` does not exist.

---

## 6. Security & Parameterized Query Implementation

Concatenating user inputs into SQL strings exposes applications to devastating **SQL Injection (SQLi)** attacks. In Lab 03, all user-provided data is bound via parameterized placeholders (`?`).

```javascript
// SECURE: Parameterized Query with Safe Whitelisting
const whereConditions = [];
const queryParams = [];

if (search_q && search_q.trim() !== '') {
  whereConditions.push(`title LIKE ?`);
  queryParams.push(`%${search_q.trim()}%`);
}

if (parsedMinPrice !== null) {
  whereConditions.push(`price >= ?`);
  queryParams.push(parsedMinPrice);
}

if (parsedMaxPrice !== null) {
  whereConditions.push(`price <= ?`);
  queryParams.push(parsedMaxPrice);
}

const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

// Column names in ORDER BY cannot be bound by '?' in SQLite prepared statements.
// Therefore, order_by and order MUST be strictly validated against whitelists before injection:
const getBooksQuery = `
  SELECT *
  FROM book
  ${whereClause}
  ORDER BY ${safeOrderBy} ${safeOrder}
  LIMIT ? OFFSET ?;
`;

queryParams.push(parsedLimit, parsedOffset);

const books = await db.all(getBooksQuery, queryParams);
```

---

## 7. Debugging Exercises & Solutions

During development, four critical backend bugs were investigated, diagnosed, and resolved:

### 1. `EADDRINUSE` (Address Already in Use) Port Conflict
- **Symptom:** Server crashes immediately on startup with:
  ```text
  Error: listen EADDRINUSE: address already in use :::3000
  ```
- **Diagnosis:** A background process (e.g., zombie Node.js process, earlier test instance, or another local service) is already bound to TCP port 3000.
- **Root Cause & Fix:**
  1. Made the port configurable using environment variables: `const PORT = process.env.PORT || 3000;`.
  2. Added an explicit `error` event listener on the HTTP server to report a human-readable diagnostic message instead of an unhandled crash:
     ```javascript
     server.on('error', (err) => {
       if (err.code === 'EADDRINUSE') {
         console.error(`Port ${PORT} is already in use. Please terminate the conflicting process or change PORT.`);
       }
       process.exit(1);
     });
     ```
  3. Terminated conflicting processes using `npx kill-port 3000` or PowerShell: `Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`.

---

### 2. Wrong Import Path (`MODULE_NOT_FOUND`)
- **Symptom:** `Error: Cannot find module '../server'` or failure to resolve native drivers.
- **Diagnosis:** Relative file path misconfiguration when importing modules or confusing npm packages with local files.
- **Root Cause & Fix:**
  1. Standardized all internal file resolutions using `path.join(__dirname, ...)` to ensure cross-platform compatibility across Windows, Linux, and Vercel serverless environments.
  2. Ensured external dependencies are imported directly by package name (`const { open } = require('sqlite'); const sqlite3 = require('sqlite3');`).

---

### 3. SQLite Table-Name Typo (`no such table`)
- **Symptom:** API endpoints fail with status 500:
  ```text
  SQLITE_ERROR: no such table: books
  ```
- **Diagnosis:** Schema mismatch where the table was created as `book` (singular) but a query was written as `SELECT * FROM books` (plural).
- **Root Cause & Fix:**
  1. Standardized table nomenclature to the singular noun `book` across all SQL DDL and DML queries:
     - `CREATE TABLE IF NOT EXISTS book ...`
     - `SELECT * FROM book ...`
     - `INSERT INTO book ...`
     - `UPDATE book ...`
     - `DELETE FROM book ...`
  2. Implemented database readiness middleware (`app.use(async (req, res, next) => { await initializeDB(); next(); });`) to guarantee table existence before executing any route.

---

### 4. Missing `await` During Asynchronous Database Operations
- **Symptom:** Responses return empty objects `{}` or raw `[object Promise]`, or route execution completes before the query finishes, causing subsequent queries to fail.
- **Diagnosis:** Omitting the `await` keyword before Promise-returning database methods (`db.all()`, `db.get()`, `db.run()`, `open()`).
- **Root Cause & Fix:**
  1. All database operations in `sqlite` return Promises.
  2. Declared all route handlers as `async (req, res) => { ... }`.
  3. Enforced `await` on every asynchronous invocation:
     ```javascript
     // INCORRECT (Missing await):
     // const books = db.all(getBooksQuery); // returns Promise { <pending> }
     
     // CORRECT:
     const books = await db.all(getBooksQuery, queryParams);
     res.status(200).json(books);
     ```

---

## 8. Automated Postman & Newman Verification

A comprehensive Postman test suite is provided at [`lab-03/BDF-Lab-03.postman_collection.json`](BDF-Lab-03.postman_collection.json).

### Live Newman Verification Results (18 Tests / 36 Assertions Passed)

All 18 requests and 36 test assertions were executed directly against the live Vercel production API ([https://lab-03-ruby.vercel.app](https://lab-03-ruby.vercel.app)) using **Newman** with the HTMLExtra reporter:

```text
Running Newman against live Vercel API: https://lab-03-ruby.vercel.app ...
newman

BDF Lab 03 - REST API, Query Parameters & Validation

→ 1. GET All Books (Default Parameters)
  GET https://lab-03-ruby.vercel.app/books/ [200 OK, 1.38kB, 574ms]
  √  Status code is 200 OK
  √  Response is an array of books

→ 2. GET Books - Search by Title (search_q)
  GET https://lab-03-ruby.vercel.app/books/?search_q=Clean [200 OK, 500B, 510ms]
  √  Status code is 200 OK
  √  Returned books match partial title 'Clean'

→ 3. GET Books - Sort by Price ASC (order_by & order)
  GET https://lab-03-ruby.vercel.app/books/?order_by=price&order=ASC [200 OK, 1.38kB, 590ms]
  √  Status code is 200 OK
  √  Books are sorted in ascending order of price

→ 4. GET Books - Sort by Price DESC (order_by & order)
  GET https://lab-03-ruby.vercel.app/books/?order_by=price&order=DESC [200 OK, 1.38kB, 318ms]
  √  Status code is 200 OK
  √  Books are sorted in descending order of price

→ 5. GET Books - Pagination (limit & offset)
  GET https://lab-03-ruby.vercel.app/books/?limit=3&offset=0 [200 OK, 709B, 359ms]
  √  Status code is 200 OK
  √  Returns exactly limit count of records

→ 6. GET Books - Price Range Filter (min_price & max_price)
  GET https://lab-03-ruby.vercel.app/books/?min_price=400&max_price=600 [200 OK, 893B, 253ms]
  √  Status code is 200 OK
  √  All returned books have price within range 400 - 600

→ 7. GET Single Book by ID
  GET https://lab-03-ruby.vercel.app/books/1/ [200 OK, 498B, 263ms]
  √  Status code is 200 OK
  √  Response contains valid book details for ID 1

→ 8. POST Create Book (Valid Request - 201 Created)
  POST https://lab-03-ruby.vercel.app/books/ [201 Created, 463B, 265ms]
  √  Status code is 201 Created
  √  Response confirms book addition and returns bookId

→ 9. POST Reject Missing Title (Validation - 400 Bad Request)
  POST https://lab-03-ruby.vercel.app/books/ [400 Bad Request, 542B, 256ms]
  √  Status code is 400 Bad Request
  √  Error response indicates missing title

→ 10. POST Reject Missing Author (Validation - 400 Bad Request)
  POST https://lab-03-ruby.vercel.app/books/ [400 Bad Request, 544B, 397ms]
  √  Status code is 400 Bad Request
  √  Error response indicates missing author

→ 11. POST Reject Non-Numeric Price (Validation - 400 Bad Request)
  POST https://lab-03-ruby.vercel.app/books/ [400 Bad Request, 548B, 362ms]
  √  Status code is 400 Bad Request
  √  Error response indicates invalid price

→ 12. GET Reject Invalid order_by Column (Validation - 400 Bad Request)
  GET https://lab-03-ruby.vercel.app/books/?order_by=injection_attempt [400 Bad Request, 638B, 288ms]
  √  Status code is 400 Bad Request
  √  Error response indicates invalid column

→ 13. GET Reject min_price Greater Than max_price (Validation - 400 Bad Request)
  GET https://lab-03-ruby.vercel.app/books/?min_price=900&max_price=300 [400 Bad Request, 538B, 261ms]
  √  Status code is 400 Bad Request
  √  Error response indicates min_price > max_price

→ 14. PUT Update Book Details (200 OK)
  PUT https://lab-03-ruby.vercel.app/books/13/ [200 OK, 456B, 262ms]
  √  Status code is 200 OK
  √  Response confirms book update

→ 15. DELETE Book by ID (200 OK)
  DELETE https://lab-03-ruby.vercel.app/books/13/ [200 OK, 448B, 268ms]
  √  Status code is 200 OK
  √  Response confirms book deletion

→ 16. GET Book by Non-Existent ID (404 Not Found)
  GET https://lab-03-ruby.vercel.app/books/99999/ [404 Not Found, 477B, 257ms]
  √  Status code is 404 Not Found
  √  Returns error object for missing book

→ 17. PUT Update Non-Existent ID (404 Not Found)
  PUT https://lab-03-ruby.vercel.app/books/99999/ [404 Not Found, 469B, 324ms]
  √  Status code is 404 Not Found
  √  Returns error object for non-existent update

→ 18. DELETE Non-Existent ID (404 Not Found)
  DELETE https://lab-03-ruby.vercel.app/books/99999/ [404 Not Found, 469B, 324ms]
  √  Status code is 404 Not Found
  √  Returns error object for non-existent deletion

┌─────────────────────────┬─────────────────────┬────────────────────┐
│                         │            executed │             failed │
├─────────────────────────┼─────────────────────┼────────────────────┤
│              iterations │                   1 │                  0 │
│                requests │                  18 │                  0 │
│              assertions │                  36 │                  0 │
│           total duration│                7.5s │                    │
└─────────────────────────┴─────────────────────┴────────────────────┘
SUCCESS: ALL 36 ASSERTIONS PASSED AGAINST LIVE VERCEL API!
```

- **Interactive HTMLExtra Dashboard Report:** [`screenshots/Lab-03-API-Test-Report.html`](screenshots/Lab-03-API-Test-Report.html)
- **Terminal Execution Summary File:** [`screenshots/test-results.txt`](screenshots/test-results.txt)

---

## 9. Vercel Deployment & SQLite Persistence Limitations

The project is deployed in production on Vercel:
- **Live Base URL:** [https://lab-03-ruby.vercel.app](https://lab-03-ruby.vercel.app)
- **Production Alias:** `https://lab-03-mk8ndkl0p-ashammagarimanishwarreddy-7609s-projects.vercel.app`

### Architecture & SQLite Persistence Limitations
1. **Read-Only Serverless Bundle (`/var/task`):**
   Vercel serverless functions run in an immutable Lambda container where the application deployment folder is strictly read-only. Attempting to write directly to `./books.db` causes an `EROFS: read-only file system` error.
2. **Cold-Start `/tmp` Initialization:**
   In `server.js`, when `process.env.VERCEL` is active, the application automatically copies the bundled, pre-seeded `books.db` to `/tmp/books.db` on cold boot. SQLite opens `/tmp/books.db` with read-write permissions, enabling full runtime CRUD functionality (`POST`, `PUT`, `DELETE`).
3. **Stateless Container Lifecycle:**
   The `/tmp` directory is ephemeral and isolated to the specific execution container instance. Any database modifications (`POST`, `PUT`, `DELETE`) will persist while that container remains warm. When the serverless function scales to zero or initializes a new container instance, `/tmp/books.db` resets back to the initial 10 pre-seeded books. For permanent enterprise persistence across serverless cold starts, a cloud database such as PostgreSQL (Neon / Supabase), Turso (libSQL), or MongoDB Atlas should be utilized.

---

## 10. Technical Viva Q&A

### Q1: What is the difference between a query parameter and a path parameter?
- **Path Parameter:**
  - Part of the hierarchical URL path (e.g., `/books/1/` or `/books/:bookId/`).
  - Used to identify a **specific resource** or entity.
  - Essential to the identity of the resource; omitting it completely changes the endpoint route.
- **Query Parameter:**
  - Appended to the end of the URL after the `?` delimiter and separated by `&` (e.g., `/books/?search_q=Clean&order_by=price&order=ASC&limit=5`).
  - Used for **filtering, searching, sorting, and pagination**.
  - Optional; omitting query parameters allows the endpoint to return default or unfiltered representations of the resource collection without altering the route identity.

---

### Q2: What does stateless mean in RESTful API architecture?
- **Statelessness** means that each HTTP request from a client must contain all the information necessary for the server to understand and process the request independently.
- The server does **not store any client session context** on the server between requests.
- **Benefits:**
  1. **High Scalability:** Any server in a cluster or any serverless container can process any incoming request without needing shared memory or sticky sessions.
  2. **Reliability & Fault Tolerance:** If a server restarts or fails, ongoing sessions are not lost because the client carries its own credentials/tokens and state in each request.
  3. **Simplified Caching:** Independent, stateless requests are easier for CDNs, proxies, and client browsers to cache effectively.

---

### Q3: Which HTTP status code is used for bad input versus a missing record?
- **Bad Input / Validation Failure:** `HTTP 400 Bad Request`
  - Returned when the client sends malformed JSON, omits mandatory fields (e.g., missing `title` or `author`), provides incompatible data types (e.g., string price instead of number), or supplies invalid query parameters (e.g., unsupported sort column or `min_price > max_price`).
  - Indicates that the client made a syntactic or semantic error in formulating the request.
- **Missing Record / Resource Not Found:** `HTTP 404 Not Found`
  - Returned when the client request is well-formed, but the targeted resource identified by the URL path does not exist in the database (e.g., querying `GET /books/99999/` when book ID 99999 does not exist).
  - Indicates that the server understood the request, but the requested entity could not be found.

---

## 11. Installation & Local Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v24.x, as specified by `package.json`)
- [npm](https://www.npmjs.com/)

### Step-by-Step Setup:
1. Navigate to the `lab-03` directory:
   ```bash
   cd lab-03
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server locally:
   ```bash
   npm start
   ```
   *For live auto-reloading during development:*
   ```bash
   npm run dev
   ```
4. Run the Newman collection. By default, its `baseUrl` collection variable targets the deployed API, so this command exercises the live deployment:
   ```bash
   npm run test:api
   ```
   To target a local server instead, start it in one terminal and run Newman in another with the collection variable overridden:
   ```bash
   npx newman run BDF-Lab-03.postman_collection.json --env-var "baseUrl=http://localhost:3000"
   ```
