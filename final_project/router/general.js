const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    return await res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
        return await res.status(200).json(books[isbn]);
    }
    return res.status(400).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    if(author){
        let targetBook = -1;
        for (let index = 1; index < 11; index++) {
            console.log(author + " " +  books[index].author);
            if(author.toString() == books[index].author){
                targetBook = index;
            }
        }
        if(targetBook != -1){
         return await res.status(200).json(books[targetBook]);
        }
    }
    return res.status(400).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title;
    if(title){
        let targetBook = -1;
        for (let index = 1; index < 11; index++) {
            if(title.toString() == books[index].title){
                targetBook = index;
            }
        }
        if(targetBook != -1){
         return await res.status(200).json(books[targetBook]);
        }
    }
    return res.status(400).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(400).json({message: "Book not found"});
});

module.exports.general = public_users;
