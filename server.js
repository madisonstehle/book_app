'use strict';
const superagent = require('superagent');
const express = require('express');
const app = express();
app.use(express.static('/public'));
app.set('view engine', 'ejs');


app.get('/', (request, response) => {
  response.render('pages/index.ejs');
});







app.listen(process.env.PORT, ()=> console.log(`'server up on ${process.env.PORT}`));

