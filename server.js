'use strict';

// REQUIRE
const superagent = require('superagent');
const express = require('express');
require('dotenv').config();
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);



// EJS
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get('/', getBooks);

function getBooks(request, response){
  let SQL = 'SELECT * FROM libraries;';
 return client.query(SQL)
  .then(results => {
    console.log(results.rows);
    response.render('pages/index.ejs', {booklist: results.rows})})

  .catch(() => { console.log('error')});
}

app.get('/searches/new', (request, response) => {
  response.render('pages/searches/new.ejs');
});

app.post('/searches', (request, response) => {
  let searchQuery = request.body.search; // search bar
  let title = request.body.title; // title radio
  let author = request.body.author; // author radio

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  
  if (title) {
    url += `+intitle:${searchQuery}`;
    console.log(url);
  } else if (author) {
    url += `+inauthor:${searchQuery}`;
    console.log(url);
  } else {
    response.render('pages/error.ejs');
  }

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
  this.cover = bookData.imageLinks.thumbnail;
  this.title = bookData.title;
  this.author = bookData.authors;
  this.description = bookData.description;
}
client.connect()
.then(() =>{

  app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));

})
.catch(() => { console.log('error')});

