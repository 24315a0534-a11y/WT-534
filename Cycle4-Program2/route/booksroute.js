const express = require('express');
const router = express.Router();

// install express validator to validate data
const { body, param, validationResult } = require('express-validator');

let { books, nextId } = require('../book'); // import books data from books.js

// validation rules
const validateIDParam = [
  param('id').isInt({ gt: 0 }).withMessage('Invalid ID')
];

const validateBook = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('author').trim().notEmpty().withMessage('Author is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
];

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next(); // proceed to the next middleware or route handler
};

// GET all books
router.get('/', (req, res) => {
  try {
    res.json(books);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

// GET book by ID
router.get('/:id', validateIDParam, handleValidationErrors, (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).send('Book not found');
  }

  res.json(book);
});

// POST new book
router.post('/', validateBook, handleValidationErrors, (req, res) => {
  const newBook = { id: nextId++, ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
router.put('/:id', validateIDParam, validateBook, handleValidationErrors, (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(book => book.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const updatedBook = {
    ...books[index],
    name: req.body.name,
    author: req.body.author,
    price: req.body.price,
    quantity: req.body.quantity
  };

  books[index] = updatedBook;
  res.json(updatedBook);
});

// DELETE book
router.delete('/:id', validateIDParam, handleValidationErrors, (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(book => book.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;