// controllers/booksController.js

import Book from "../models/Book";

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addBook = async (req, res) => {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      filePath: req.file.path
    });
    try {
      const newBook = await book.save();
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
