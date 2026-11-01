# Lab 02 Postman Test Screenshots

Save your captured Postman verification screenshots in this folder using the following filenames:

1. `01-get-all-books.png`
   - **Method:** `GET`
   - **Endpoint:** `http://localhost:3000/books/`
   - **Expected Status:** `200 OK`
   - **Description:** Postman output displaying the array of all books from the SQLite database.

2. `02-get-single-book.png`
   - **Method:** `GET`
   - **Endpoint:** `http://localhost:3000/books/1/`
   - **Expected Status:** `200 OK`
   - **Description:** Postman output displaying a single book object matching the `:bookId` route parameter.

3. `03-post-create-book.png`
   - **Method:** `POST`
   - **Endpoint:** `http://localhost:3000/books/`
   - **Expected Status:** `201 Created`
   - **Description:** Postman output with JSON request body (`title`, `author`, `price`, `pages`) showing `"Book Added Successfully"` and the created `bookId`.

4. `04-put-update-book.png`
   - **Method:** `PUT`
   - **Endpoint:** `http://localhost:3000/books/1/`
   - **Expected Status:** `200 OK`
   - **Description:** Postman output with updated JSON values showing `"Book Details Updated Successfully"`.

5. `05-delete-book.png`
   - **Method:** `DELETE`
   - **Endpoint:** `http://localhost:3000/books/11/`
   - **Expected Status:** `200 OK`
   - **Description:** Postman output showing `"Book Deleted Successfully"`.

---
### Capture Instructions (Windows)
1. In Postman, execute each request against your locally running server (`npm start`).
2. Press **`Win + Shift + S`** (Windows Snipping Tool) to capture the Postman window showing the HTTP Method, URL, Status Code, and JSON Response body.
3. Save the image files with the exact names listed above into this `lab-02/screenshots/` directory.

