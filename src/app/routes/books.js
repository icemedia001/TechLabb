// routes/books.js
import express from "express"
const router = express.Router();
import booksController from "../controllers/book.js";

// Route to get all books
router.get('/', booksController.getAllBooks);

// Route to get a specific book by id
router.get('/:id', booksController.getBookById);

// Route to add a new book
router.post('/', booksController.addNewBook);

module.exports = router;
