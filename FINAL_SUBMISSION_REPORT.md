# Final Submission Report — BDF Lab 02 and Lab 03

**Verification date:** 2026-11-09

## Summary

Both lab folders contain source, SQLite databases, Postman collections, documentation, practical screenshots, and Newman HTML/terminal reports. The deployed GET endpoints and the Lab 03 query behaviors passed read-only checks during this review. Saved Newman runs also report no failures.

The local deliverables are present and readable. **The GitHub submission is not up to date yet:** evidence files and other worktree changes are not committed or pushed, so the public GitHub links below do not include the current local state.

## Lab 02

- **API:** `https://lab-02-two.vercel.app`
- **Source:** `server.js`; JavaScript syntax check passed.
- **Database:** `books.db`; SQLite integrity check passed and contains 10 book rows.
- **Postman collection:** `BDF-Lab-02.postman_collection.json`; valid JSON with 6 requests.
- **Documentation:** `README.md` documents the deployment, CRUD endpoints, setup, and evidence. Screenshot and test-report references were updated to match the files present.
- **Current live checks:** GET all returned 200 and 10 books; GET ID 1 returned 200; GET ID 99999 returned 404.
- **Latest saved Newman result (2026-11-09):** 6 requests, 12 assertions, 0 failures. Covers GET all, GET by ID, POST, PUT, DELETE, and GET-after-DELETE 404.
- **Reports:** [Latest HTML](lab-02/screenshots/Lab-02-Newman-2026-11-09.html), [latest terminal output](lab-02/screenshots/Lab-02-Newman-2026-11-09.txt), and earlier retained [HTML](lab-02/screenshots/Lab-02-API-Test-Report.html) / [terminal output](lab-02/screenshots/test-results.txt).

### Lab 02 screenshot inventory — 6

1. [Chrome-GET-All-Books.png](lab-02/screenshots/Chrome-GET-All-Books.png)
2. [Chrome-GET-Book-By-ID.png](lab-02/screenshots/Chrome-GET-Book-By-ID.png)
3. [Chrome-GET-Deleted-Book-404.png](lab-02/screenshots/Chrome-GET-Deleted-Book-404.png)
4. [Postman-POST-Create-Book.png](lab-02/screenshots/Postman-POST-Create-Book.png)
5. [Postman-PUT-Update-Book.png](lab-02/screenshots/Postman-PUT-Update-Book.png)
6. [Postman-DELETE-Book.png](lab-02/screenshots/Postman-DELETE-Book.png)

## Lab 03

- **API:** `https://lab-03-ruby.vercel.app`
- **Source:** `server.js`; JavaScript syntax check passed.
- **Database:** `books.db`; SQLite integrity check passed and contains 10 book rows.
- **Postman collection:** `BDF-Lab-03.postman_collection.json`; valid JSON with 18 requests.
- **Documentation:** `README.md` includes student details, deployment and repository links, endpoint/query documentation, validation behavior, and setup instructions. The local Node prerequisite and Newman target behavior are now explicit.
- **Current live checks:** GET all returned 200 and 10 books; GET ID 1 returned 200; missing ID returned 404. Search (`search_q`), ascending and descending price sort (`order_by`/`order`), pagination (`limit`/`offset`), and price filtering (`min_price`/`max_price`) returned matching results.
- **Latest saved Newman result (2026-11-09):** 18 requests, 36 assertions, 0 failures. Collection coverage includes query behaviors, validation failures, CRUD, and not-found cases.
- **Reports:** [Latest HTML](lab-03/screenshots/Lab-03-Newman-2026-11-09.html), [latest terminal output](lab-03/screenshots/Lab-03-Newman-2026-11-09.txt), and earlier retained [HTML](lab-03/screenshots/Lab-03-API-Test-Report.html) / [terminal output](lab-03/screenshots/test-results.txt).

### Lab 03 screenshot inventory — 11

1. [Chrome-GET-All-Books.png](lab-03/screenshots/Chrome-GET-All-Books.png)
2. [Chrome-Search-Books.png](lab-03/screenshots/Chrome-Search-Books.png)
3. [Chrome-Sort-Books.png](lab-03/screenshots/Chrome-Sort-Books.png)
4. [Chrome-Pagination.png](lab-03/screenshots/Chrome-Pagination.png)
5. [Chrome-Price-Filter.png](lab-03/screenshots/Chrome-Price-Filter.png)
6. [Chrome-GET-Book-By-ID.png](lab-03/screenshots/Chrome-GET-Book-By-ID.png)
7. [Chrome-GET-Not-Found.png](lab-03/screenshots/Chrome-GET-Not-Found.png)
8. [Postman-POST-Create-Book.png](lab-03/screenshots/Postman-POST-Create-Book.png)
9. [Postman-POST-Validation-Error.png](lab-03/screenshots/Postman-POST-Validation-Error.png)
10. [Postman-PUT-Update-Book.png](lab-03/screenshots/Postman-PUT-Update-Book.png)
11. [Postman-DELETE-Book.png](lab-03/screenshots/Postman-DELETE-Book.png)

## Screenshot and test verification

- All 17 PNGs were decoded successfully. Chrome captures are 1536×864; Postman captures are 1920×1079. Representative Chrome and Postman captures were visually checked for the expected URL, readable response, request method, body where applicable, and response status.
- Both labs' latest Newman HTML and terminal reports are present. The reported totals are from the saved 2026-11-09 runs; Newman was not rerun during this review to avoid repeating write operations against the deployed APIs. Read-only live GET checks were run for this report.
- Both Postman collections parse as JSON. Both source files pass `node --check`.
- No required local screenshot or report was missing in the inspected folders.

## Submission links

- **Lab 02:** https://github.com/manishwarreddy/BDF-LabS/tree/main/lab-02
- **Lab 03:** https://github.com/manishwarreddy/BDF-LabS/tree/main/lab-03
- **Complete repository:** https://github.com/manishwarreddy/BDF-LabS

## Remaining issues and checklist

- [x] Lab 02/03 source files and setup documentation inspected.
- [x] Both local SQLite databases pass integrity checks and contain 10 rows.
- [x] Postman collections parse; live GET/query checks pass.
- [x] 6 Lab 02 and 11 Lab 03 screenshots exist and open.
- [x] Newman HTML and terminal reports are available for both labs.
- [ ] **Publish the current local deliverables to GitHub before submitting the online links.** The screenshot/report files are untracked. At the start of this review, local modifications already existed in the Lab 02 collection and README files and in Lab 03's README, `.gitignore`, `package.json`, `server.js`, and `vercel.json`. This review updated the two main README files and added this report. No commit or push was made, as requested.

This review did not modify API source code, databases, Lab 01, or Git history. Vercel's SQLite writes are ephemeral as documented by the projects; no write requests were sent during this review.
