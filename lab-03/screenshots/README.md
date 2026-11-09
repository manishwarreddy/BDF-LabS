# Lab 03 API Verification & Test Evidence

This directory contains verified test reports and execution summaries for BDF Lab 03 executed against the live deployed Vercel production API: **`https://lab-03-ruby.vercel.app`**.

## Retained individual screenshots

- `Chrome-GET-All-Books.png`
- `Chrome-Search-Books.png`
- `Chrome-Sort-Books.png`
- `Chrome-Pagination.png`
- `Chrome-Price-Filter.png`
- `Chrome-GET-Book-By-ID.png`
- `Chrome-GET-Not-Found.png`
- `Postman-POST-Create-Book.png`
- `Postman-POST-Validation-Error.png`
- `Postman-PUT-Update-Book.png`
- `Postman-DELETE-Book.png`

The Chrome images show the deployed endpoint URL and raw JSON response. The Postman screenshots show the actual method, complete URL, response status, and JSON response. Request bodies are visible for POST and PUT; DELETE has no request body.

## Test Artifacts
- **Interactive HTML Test Report:** [`Lab-03-API-Test-Report.html`](Lab-03-API-Test-Report.html)  
  *Comprehensive HTMLExtra visual dashboard with request/response payloads, HTTP status codes, headers, and 36 passed assertions across all 18 test cases on the live deployment.*
- **Terminal Summary File:** [`test-results.txt`](test-results.txt)  
  *Timestamped plain text summary of the live Newman collection run.*
- **Latest Newman output:** `Lab-03-Newman-2026-11-09.html` and `Lab-03-Newman-2026-11-09.txt` (18 requests, 36 assertions, 0 failures).

## Test Cases Summary (18/18 Passed, 36/36 Assertions Passed)

| # | Request Name | Method | Live URL / Query | Expected Status | Result |
|---|---|---|---|---|---|
| 1 | GET All Books (Default Parameters) | `GET` | `https://lab-03-ruby.vercel.app/books/` | `200 OK` | Pass (10 books returned) |
| 2 | GET Books - Search by Title | `GET` | `https://lab-03-ruby.vercel.app/books/?search_q=Clean` | `200 OK` | Pass (matched "Clean Code") |
| 3 | GET Books - Sort by Price ASC | `GET` | `https://lab-03-ruby.vercel.app/books/?order_by=price&order=ASC` | `200 OK` | Pass (ascending order verified) |
| 4 | GET Books - Sort by Price DESC | `GET` | `https://lab-03-ruby.vercel.app/books/?order_by=price&order=DESC` | `200 OK` | Pass (descending order verified) |
| 5 | GET Books - Pagination | `GET` | `https://lab-03-ruby.vercel.app/books/?limit=3&offset=0` | `200 OK` | Pass (exact limit of 3 returned) |
| 6 | GET Books - Price Range Filter | `GET` | `https://lab-03-ruby.vercel.app/books/?min_price=400&max_price=600` | `200 OK` | Pass (all prices within 400-600) |
| 7 | GET Single Book by ID | `GET` | `https://lab-03-ruby.vercel.app/books/1/` | `200 OK` | Pass (book 1 returned) |
| 8 | POST Create Book | `POST` | `https://lab-03-ruby.vercel.app/books/` | `201 Created` | Pass (new bookId generated) |
| 9 | POST Reject Missing Title | `POST` | `https://lab-03-ruby.vercel.app/books/` | `400 Bad Request` | Pass (validation error returned) |
| 10 | POST Reject Missing Author | `POST` | `https://lab-03-ruby.vercel.app/books/` | `400 Bad Request` | Pass (validation error returned) |
| 11 | POST Reject Non-Numeric Price | `POST` | `https://lab-03-ruby.vercel.app/books/` | `400 Bad Request` | Pass (validation error returned) |
| 12 | GET Reject Invalid order_by Column | `GET` | `https://lab-03-ruby.vercel.app/books/?order_by=injection_attempt` | `400 Bad Request` | Pass (whitelist enforced) |
| 13 | GET Reject min_price > max_price | `GET` | `https://lab-03-ruby.vercel.app/books/?min_price=900&max_price=300` | `400 Bad Request` | Pass (range logic enforced) |
| 14 | PUT Update Book Details | `PUT` | `https://lab-03-ruby.vercel.app/books/:bookId/` | `200 OK` | Pass (details updated) |
| 15 | DELETE Book by ID | `DELETE` | `https://lab-03-ruby.vercel.app/books/:bookId/` | `200 OK` | Pass (book deleted) |
| 16 | GET Book by Non-Existent ID | `GET` | `https://lab-03-ruby.vercel.app/books/99999/` | `404 Not Found` | Pass (error returned) |
| 17 | PUT Update Non-Existent ID | `PUT` | `https://lab-03-ruby.vercel.app/books/99999/` | `404 Not Found` | Pass (error returned) |
| 18 | DELETE Non-Existent ID | `DELETE` | `https://lab-03-ruby.vercel.app/books/99999/` | `404 Not Found` | Pass (error returned) |
