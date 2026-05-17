const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {

    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then((data) => {
        res.send(JSON.stringify(data, null, 3));
    })
    .catch(() => {
        res.status(500).json({
            message: "Error getting books"
        });
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        const book = await Promise.resolve(books[isbn]);

        if (book) {
            return res.send(book);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching book"
        });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    // Get author from request parameter
    const authorName = req.params.author;

    new Promise((resolve, reject) => {

        // Get all books matching the author
        const filteredBooks = Object.keys(books)
            .filter((key) => books[key].author === authorName)
            .map((key) => books[key]);

        // Check if any books found
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found for this author");
        }

    })
    .then((data) => {
        res.send(data);
    })
    .catch((err) => {
        res.status(404).json({
            message: err
        });
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
