'use strict';

const superagent = require('superagent');
const express = require('express');

require('dotenv').config();

const app = express();

app.use(express.static('/public'));
app.set('view engine', 'ejs');


app.get('/', (request, response) => {
  response.render('pages/index.ejs');
});






console.log(process.env.PORT);

app.listen(process.env.PORT, () => console.log(`server up on ${process.env.PORT}`));

