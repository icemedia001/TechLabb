import express from "express";
const router = express.Router();
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import Book from "../models/Book.js";
import { verifyToken } from "../middleware/auth.js";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage });

// Create a new book
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const pdfDoc = await PDFDocument.load(await fs.promises.readFile(path));
    const title = pdfDoc.getTitle();
    const author = pdfDoc.getAuthor();
    const book = new Book({ title, author, file: path });
    await book.save();
    return res.status(201).json({ message: 'Book uploaded successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to upload book' });
  }
});

// Retrieve all books
router.get('/', verifyToken, async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to retrieve books' });
  }
});

// Retrieve a single book by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to retrieve book' });
  }
});

// Update a book by ID
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (req.body.title) {
      book.title = req.body.title;
    }
    if (req.body.author) {
      book.author = req.body.author;
    }
    await book.save();
    return res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update book' });
  }
});

// Delete a book by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await book.remove();
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to delete book' });
  }
});

export default router;
