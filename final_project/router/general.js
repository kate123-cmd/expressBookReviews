const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let users = [];

const doesExist = (username) => {
    let usersWithSameName = users.filter((user) => {
        return user.username === username;
    });

    return usersWithSameName.length > 0;
};

public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or password missing"
        });
    }

    // Check if user already exists
    if (doesExist(username)) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    // Register new user
    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
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
  // Get ISBN from request parameters
  const isbn = req.params.isbn;

  // Check if book exists
  if (books[isbn]) {

      // Return reviews of the book
      return res.send(JSON.stringify(books[isbn].reviews));
  }

  // If ISBN not found
  return res.status(404).json({
      message: "Book not found"
  });
});

module.exports.general = public_users;
