const express = require('express');

// Import books database
let books = require("./booksdb.js");

// Import helper functions and users array
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

// Import axios
const axios = require('axios');

// Create router object
const public_users = express.Router();


// Check if username already exists
const doesExist = (username) => {

    // Filter users array
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    // Return true if user exists
    return userswithsamename.length > 0;
};


// Register new user
public_users.post("/register", (req, res) => {

    // Get username and password
    const username = req.body.username;
    const password = req.body.password;

    // Validate input
    if (username && password) {

        // Check if user already exists
        if (!doesExist(username)) {

            // Add user to users array
            users.push({
                "username": username,
                "password": password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });

        } else {

            return res.status(404).json({
                message: "User already exists!"
            });
        }
    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});


// Get all books
public_users.get('/', async function (req, res) {

    try {

        // Return all books
        return res.send(JSON.stringify(books, null, 3));

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books"
        });
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    // Get ISBN from request parameters
    const isbn = req.params.isbn;

    try {

        // Fetch all books using axios
        const response = await axios.get('http://localhost:5000/');

        // Store response data
        const booksData = response.data;

        // Get book using ISBN
        const book = booksData[isbn];

        // Return book if found
        if (book) {
            return res.send(book);
        }

        // Book not found
        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching book"
        });
    }
});


// Get books based on author
public_users.get('/author/:author', async function (req, res) {

    // Get author from request parameters
    const authorName = req.params.author;

    try {

        // Fetch all books using axios
        const response = await axios.get('http://localhost:5000/');

        // Store response data
        const booksData = response.data;

        // Filter books by author
        const filteredBooks = Object.keys(booksData)
            .filter((key) => booksData[key].author === authorName)
            .map((key) => booksData[key]);

        // Return matching books
        if (filteredBooks.length > 0) {
            return res.send(filteredBooks);
        }

        // No books found
        return res.status(404).json({
            message: "No books found for this author"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});


// Get books based on title
public_users.get('/title/:title', async function (req, res) {

    // Get title from request parameters
    const title = req.params.title;

    try {

        // Fetch all books using axios
        const response = await axios.get('http://localhost:5000/');

        // Store response data
        const booksData = response.data;

        // Filter books by title
        const filteredBooks = Object.keys(booksData)
            .filter((key) => booksData[key].title === title)
            .map((key) => booksData[key]);

        // Return matching books
        if (filteredBooks.length > 0) {
            return res.send(filteredBooks);
        }

        // No books found
        return res.status(404).json({
            message: "No books found with this title"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching books"
        });
    }
});


// Get reviews for a book
public_users.get('/review/:isbn', async function (req, res) {

    // Get ISBN from request parameters
    const isbn = req.params.isbn;

    try {

        // Fetch all books using axios
        const response = await axios.get('http://localhost:5000/');

        // Store response data
        const booksData = response.data;

        // Check if book exists
        if (booksData[isbn]) {

            // Return reviews
            return res.send(JSON.stringify(
                booksData[isbn].reviews
            ));
        }

        // Book not found
        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error fetching reviews"
        });
    }
});


// Export router
module.exports.general = public_users;
