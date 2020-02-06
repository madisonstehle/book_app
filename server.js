'use strict';

const superagent = require('superagent');
const express = require('express');

require('dotenv').config();

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.render('pages/index.ejs');
});

app.get('/searches/new', (request, response) => {
  // let newBook = new Book('title', 'author');
  // console.log(newBook);
  response.render('pages/searches/new.ejs');
});

// function Book(title, author) {
//   this.title = title;
//   this.author = author;
// }

app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));

