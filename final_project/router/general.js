const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = { username, email, password };
    users.push(newUser);

    // Assuming registration is successful, send a success response
    return res.status(200).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // If an error occurs during registration, send an error response
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
});



// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    const bookList = response.data;
    return res.status(200).json({ books: bookList });
  } catch (error) {
    console.error("Error retrieving books:", error);
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN
const fetchBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching book details");
  }
};

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await fetchBookByISBN(isbn);

    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error retrieving book details:", error);
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);

    const matchingBooks = response.data.books;
    
    if (matchingBooks.length > 0) {
      return res.status(200).json({ matchingBooks });
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
    }
  } catch (error) {
    console.error("Error retrieving books by author:", error);
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);

    const titles = response.data.titles;

    if (titles.length > 0) {
      return res.status(200).json({ titles });
    } else {
      return res.status(404).json({ message: "Title not found" });
    }
  } catch (error) {
    console.error("Error retrieving books by title:", error);
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports.general = public_users;
