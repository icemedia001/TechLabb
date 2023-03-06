import Book from "../models/Book.js";

import { extname } from 'path';

// Create a new book
const createBook = async (req, res) => {
  try {
    // Check if uploaded file is a PDF
    if (extname(req.file.originalname) !== '.pdf') {
      return res.status(400).json({ message: 'File must be a PDF' });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      file: req.file.path
    });

    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create book' });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get books' });
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get book' });
  }
};

// Update a book by ID
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        author: req.body.author
      },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};

export default {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
};
