'use strict';

// REQUIRE
const superagent = require('superagent');
const express = require('express');
require('dotenv').config();
const app = express();

// EJS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get('/', (request, response) => {
  response.render('pages/index.ejs');
});

app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new.ejs');
});

app.post('/searches', (request, response) => {
  let searchQuery = request.body.title || request.body.author;

  let url = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`;

  try {
    superagent.get(url)
      .then(data =>{
        let bookArray = data.body.items.map( items => {
          let resultData = items.volumeInfo;
          let book = new Book(resultData);
          return book;
        });
        // console.log(bookArray);
        response.render('pages/searches/show.ejs', { books: bookArray });
      });
  }
  catch {
    response.render('pages/error.ejs');
  }

});


function Book(bookData) {
  this.cover = bookData.imageLinks.smallThumbnail;
  this.title = bookData.title;
  this.author = bookData.authors;
  this.description = bookData.description;
}

app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));

