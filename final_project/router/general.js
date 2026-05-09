const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,3));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Get all keys from books object
  const bookKeys = Object.keys(books);

  // Get author from request parameter
  const authorName = req.params.author;

  // Iterate through books
  bookKeys.forEach((key) => {
      // Check if author matches
      if (books[key].author === authorName) {
          return res.send(books[key]);
      }
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   // Get all keys from books object
   const bookKeys = Object.keys(books);

   // Get author from request parameter
   const title = req.params.title;
 
   // Iterate through books
   bookKeys.forEach((key) => {
       // Check if title matches
       if (books[key].title === title) {
           return res.send(books[key]);
       }
   });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
