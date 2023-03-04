// routes/books.js
import express from "express"
const router = express.Router();
import { getAllBooks, getBookById, addBook } from "../controllers/book.js";

// Route to get all books
router.get('/', getAllBooks);

// Route to get a specific book by id
router.get('/:id', getBookById);

// Route to add a new book
router.post('/', addBook);

module.exports = router;
