'use strict';

// REQUIRE
const superagent = require('superagent');
const express = require('express');
require('dotenv').config();
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

// GLOBAL API URL
let url = 'https://www.googleapis.com/books/v1/volumes?q=';

// EJS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get('/', getBooks);

app.get('/searches/new', (request, response) => {response.render('pages/searches/new.ejs');});

app.post('/searches', createBookArray);

app.post('/books', (request, response) => {
  let { author, title, isbn, image_url, description} = request.body;
  let SQL = `INSERT INTO libraries(author, title, isbn, image_url, description, bookshelf) 
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
  `;

  let values = [author, title, isbn, image_url, description, ''];

  client.query(SQL, values)
    .then(response.redirect('/'))
    .catch(() => { console.log('error')});
});


// HELPER FUNCTIONS
function getBooks(request, response){
  let SQL = 'SELECT * FROM libraries;';
 return client.query(SQL)
  .then(results => {
    console.log(results.rows);
    response.render('pages/index.ejs', {booklist: results.rows, bookCounts: results.rowCount})})

  .catch(() => { console.log('error')});
}

function getURL(request, response) {
  let searchQuery = request.body.search; // search bar
  let title = request.body.title; // title radio
  let author = request.body.author; // author radio

  
  if (title) {
    return url += `+intitle:${searchQuery}`;
  } else if (author) {
    return url += `+inauthor:${searchQuery}`;
  } else {
    response.render('pages/error.ejs');
  }
};

function createBookArray(request, response) {
  getURL(request, response);

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
}


// CONSTRUCTOR
function Book(bookData) {
  this.author = bookData.authors || 'no author available';
  this.title = bookData.title || 'no title available';
  this.isbn = bookData.industryIdentifiers ? bookData.industryIdentifiers[0].identifier : 'no ISBN available';
  this.cover = bookData.imageLinks.thumbnail || 'no image available';
  this.description = bookData.description || 'no description available';
}

// LISTENER
client.connect()
  .then(() =>{
    app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));
  })
  .catch(() => { console.log('error')});

