const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return username.length > 0;
  //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;

  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username"});
  }

  if (authenticatedUser(username,password)) {
    const token = jwt.sign({username}, 'secret key', {expiresIn: '1h'});
    return res.status(200).json({message: "Login ssuccessful", token});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewContent = req.body.review;

  // Write code to save the review to the database using the ISBN and review content
  // Example database operation:
  db.collection('reviews').insertOne({
    isbn: isbn,
    review: reviewContent
  }, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error saving review to database" });
    }
    return res.status(200).json({ message: "Book review successfully implemented" });
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const isbn = req.params.isbn;

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Error deleting review" });
  }
});






module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
