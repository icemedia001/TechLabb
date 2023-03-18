import express from "express";
const router = express.Router();
import multer from "multer";
import GridFsStorage from "multer-gridfs-storage";
import { PDFDocument } from "pdf-lib";
import Book from "../models/Book.js";
import { verifyToken } from "../middleware/auth.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});
const upload = multer({ storage: storage });
// Create a new GridFsStorage instance and pass in the multer options
const gfsStorage = new GridFsStorage({
  url: 'mongodb://localhost:27017/mydatabase',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: function (req, file) {
    return {
      filename: file.originalname,
      bucketName: 'files'
    };
  }
});
// Create a new multer instance with the GridFsStorage engine
const gfsUpload = multer({ storage: gfsStorage });
// Create a new book
router.post('/', gfsupload.single('file'), async (req, res) => {
  try {
    const { originalname } = req.file;
    const book = new Book({ title: originalname, file: req.file.id });
    await book.save();
    return res.status(201).json({ message: 'Book uploaded successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to upload book' });
  }
});

// Retrieve all books
router.get('/', async (req, res) => {
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
