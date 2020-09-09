const express = require('express');
const bodyParser = require('body-parser');
const service = require('./service');
const mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/qualtech',{ useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

app.post('/register', service.register);

app.get('/get', service.getAll);

app.listen(3111, () => {
  console.log(`server running at port 3111`)
})