const express = require("express");
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
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  new Promise((resolve, reject) => {
      if (books) {
          resolve(books);
      } else {
          reject("No books found");
      }
  })
  .then(books => {
      res.send(JSON.stringify({ books }, null, 4));
  })
  .catch(error => {
      res.status(300).json({ message: error });
  });
});


// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
      if (books[isbn] !== undefined) {
          resolve(books[isbn]);
      } else {
          reject("There is no book with that ISBN.");
      }
  })
  .then(book => {
      res.send(JSON.stringify(book));
  })
  .catch(error => {
      res.status(300).json({ message: error });
  });
});


// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
      const authorBooks = Object.values(books).filter(
          (book) => book.author === author
      );
      if (authorBooks.length !== 0) {
          resolve(authorBooks);
      } else {
          reject("Author not found");
      }
  })
  .then(authorBooks => {
      res.send(authorBooks);
  })
  .catch(error => {
      res.status(300).json({ message: error });
  });
});


// Get all books based on title
/**
We create a new Promise that filters the books object to find books with the provided title.
If books with the title are found, we resolve the Promise with the array of books.
If no books are found, we reject the Promise with an error message.
We use .then() to handle the resolved Promise, sending the array of books as a response.
We use .catch() to handle any errors that occur during the Promise execution, sending a response with status code 300 and an error message.
*/
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
      const titleBooks = Object.values(books).filter(
          (book) => book.title === title
      );
      if (titleBooks.length !== 0) {
          resolve(titleBooks);
      } else {
          reject("There is no book with that title.");
      }
  })
  .then(titleBooks => {
      res.send(titleBooks);
  })
  .catch(error => {
      res.status(300).json({ message: error });
  });
});


//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviewBooks = books[isbn];
  if (reviewBooks === undefined) {
    return res
      .status(300)
      .json({ message: "There is no book with that isbn." });
  }
  res.send(reviewBooks["reviews"]);
});

module.exports.general = public_users;
