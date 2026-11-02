/**
 * BDF Lab 02: SQLite and Express CRUD API
 * Student: A. Manishwar Reddy (Reg: 252U1R5011, Section: CSE 1A (AI & DE))
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Port configuration
const PORT = process.env.PORT || 3000;

let db = null;
let initPromise = null;

/**
 * Determine database path:
 * On Vercel Serverless (process.env.VERCEL), the function deployment bundle directory is read-only.
 * We copy the pre-seeded books.db from the bundle to /tmp/books.db if not already present.
 * Locally and in standard environments, books.db in the project folder is used directly.
 */
const getDatabasePath = () => {
  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'books.db');
    const sourceDbPath = path.join(__dirname, 'books.db');
    if (!fs.existsSync(tmpDbPath)) {
      if (fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
    }
    return tmpDbPath;
  }
  return path.join(__dirname, 'books.db');
};

/**
 * Asynchronously initialize SQLite database connection
 */
const initializeDB = async () => {
  if (db) return db;
  if (!initPromise) {
    initPromise = (async () => {
      const dbPath = getDatabasePath();
      const database = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });

      // Ensure book table exists
      await database.run(`
        CREATE TABLE IF NOT EXISTS book (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          author TEXT NOT NULL,
          price REAL NOT NULL,
          pages INTEGER NOT NULL
        );
      `);

      db = database;
      return db;
    })();
  }
  return initPromise;
};

/**
 * Middleware: ensure DB is initialized before processing any route
 */
app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    res.status(500).send({ error: `Database Connection Error: ${error.message}` });
  }
});

/**
 * Asynchronously initialize SQLite database connection and start Express server (Local execution)
 */
const initializeDBAndServer = async () => {
  try {
    await initializeDB();
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

// Start local server when run directly
if (require.main === module) {
  initializeDBAndServer();
}

// ==========================================
// CRUD API ROUTES
// ==========================================

/**
 * Root Route: GET /
 * Description: API welcome and health check
 */
app.get('/', (req, res) => {
  res.status(200).send('Welcome to BDF Lab 02: SQLite & Express CRUD API');
});

/**
 * Route 1: GET /books/
 * Description: Retrieve all books from the database
 * Query: SELECT * FROM book ORDER BY id;
 */
app.get('/books/', async (req, res) => {
  try {
    const getBooksQuery = `SELECT * FROM book ORDER BY id;`;
    const booksArray = await db.all(getBooksQuery);
    res.status(200).send(booksArray);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * Route 2: GET /books/:bookId/
 * Description: Retrieve a single book by its ID
 * Query: SELECT * FROM book WHERE id = ?; (parameterized)
 */
app.get('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return res.status(404).send({ error: 'Book not found' });
    }
    res.status(200).send(book);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * Route 3: POST /books/
 * Description: Insert a new book record into the database
 * Query: INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?); (parameterized)
 */
app.post('/books/', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).send({
        error: 'Missing required book details: title, author, price, pages',
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
    const bookId = dbResponse.lastID;

    res.status(201).send({
      message: 'Book Added Successfully',
      bookId: bookId,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * Route 4: PUT /books/:bookId/
 * Description: Update an existing book's details by ID
 * Query: UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?; (parameterized)
 */
app.put('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).send({ error: 'Book not found' });
    }

    const updateBookQuery = `
      UPDATE book
      SET title = ?, author = ?, price = ?, pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [
      title || existingBook.title,
      author || existingBook.author,
      price !== undefined ? price : existingBook.price,
      pages !== undefined ? pages : existingBook.pages,
      bookId,
    ]);

    res.status(200).send({ message: 'Book Details Updated Successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * Route 5: DELETE /books/:bookId/
 * Description: Delete a book from the database by ID
 * Query: DELETE FROM book WHERE id = ?; (parameterized)
 */
app.delete('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;

    const checkBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return res.status(404).send({ error: 'Book not found' });
    }

    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);

    res.status(200).send({ message: 'Book Deleted Successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/**
 * Catch-all 404 handler for undefined routes
 */
app.use((req, res) => {
  res.status(404).send({ error: '404 Not Found: The requested route does not exist' });
});

module.exports = app;

