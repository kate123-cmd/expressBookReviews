const express = require('express');

// Import books database
let books = require("./booksdb.js");

// Import helper functions and users array
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Import axios for making HTTP requests
const axios = require('axios');

// Create router object
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {

    // Filter users array to find matching username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    // Return true if user exists, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


// Register a new user
public_users.post("/register", (req, res) => {

    // Get username and password from request body
    const username = req.body.username;
    const password = req.body.password;

    // Check if username and password are provided
    if (username && password) {

        // Check if username already exists
        if (!doesExist(username)) {

            // Add new user to users array
            users.push({
                "username": username,
                "password": password
            });

            // Send success response
            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });

        } else {

            // User already exists
            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    // Username or password missing
    return res.status(404).json({
        message: "Unable to register user."
    });
});


// Get the complete list of books
public_users.get('/', function (req, res) {

    // Create a Promise to return books data
    new Promise((resolve, reject) => {

        // Resolve promise with books object
        resolve(books);

    })
    .then((data) => {

        // Send formatted JSON response
        res.send(JSON.stringify(data, null, 3));

    })
    .catch(() => {

        // Handle errors
        res.status(500).json({
            message: "Error getting books"
        });
    });

});


// Get book details using ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    // Get ISBN from request parameters
    const isbn = req.params.isbn;

    try {

        // Resolve the book corresponding to the ISBN
        const book = await Promise.resolve(books[isbn]);

        // If book exists, return book details
        if (book) {
            return res.send(book);
        }

        // If no book found
        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        // Handle server errors
        return res.status(500).json({
            message: "Error fetching book"
        });
    }
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    // Get author name from request parameters
    const authorName = req.params.author;

    // Create Promise for asynchronous processing
    new Promise((resolve, reject) => {

        // Filter books matching the author name
        const filteredBooks = Object.keys(books)
            .filter((key) => books[key].author === authorName)
            .map((key) => books[key]);

        // Resolve if books are found
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {

            // Reject if no books found
            reject("No books found for this author");
        }

    })
    .then((data) => {

        // Send matching books
        res.send(data);

    })
    .catch((err) => {

        // Handle errors
        res.status(404).json({
            message: err
        });
    });

});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    // Get title from request parameters
    const title = req.params.title;

    try {

        // Fetch all books using axios
        const response = await axios.get('http://localhost:5000/');

        // Store response data
        const booksData = response.data;

        // Filter books matching the title
        const filteredBooks = Object.keys(booksData)
            .filter((key) => booksData[key].title === title)
            .map((key) => booksData[key]);

        // Return matching books
        if (filteredBooks.length > 0) {
            return res.send(filteredBooks);
        }

        // No matching books found
        return res.status(404).json({
            message: "No books found with this title"
        });

    } catch (error) {

        // Handle errors
        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});


// Get book reviews using ISBN
public_users.get('/review/:isbn', function (req, res) {

    // Get ISBN from request parameters
    const isbn = req.params.isbn;

    // Check if the book exists
    if (books[isbn]) {

        // Return reviews for the book
        return res.send(JSON.stringify(books[isbn].reviews));
    }

    // ISBN not found
    return res.status(404).json({
        message: "Book not found"
    });
});


// Export router
module.exports.general = public_users;
