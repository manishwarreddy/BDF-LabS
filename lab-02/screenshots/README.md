# Lab 02 API Evidence

These files are evidence for the deployed API at `https://lab-02-two.vercel.app`.

## Retained screenshots

- `Chrome-GET-All-Books.png` - GET `/books/`
- `Chrome-GET-Book-By-ID.png` - GET `/books/1/`
- `Chrome-GET-Deleted-Book-404.png` - GET `/books/99999/` (404)
- `Postman-POST-Create-Book.png` - POST `/books/` (201 Created, request body shown)
- `Postman-PUT-Update-Book.png` - PUT `/books/{bookId}/` (200 OK, request body shown)
- `Postman-DELETE-Book.png` - DELETE `/books/{bookId}/` (200 OK)

The Chrome images show the deployed URL and raw JSON response. The Postman screenshots show the actual method, complete URL, response status, and JSON response. Request bodies are visible for POST and PUT; DELETE has no request body.

## Newman reports

- `Lab-02-Newman-2026-11-09.html` and `Lab-02-Newman-2026-11-09.txt` - latest run: 6 requests and 12 assertions, with 0 failures.
- `Lab-02-API-Test-Report.html` and `test-results.txt` - earlier retained test reports.

The latest collection run includes GET-after-DELETE verification and passed with 0 failures.
