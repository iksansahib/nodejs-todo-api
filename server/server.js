const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((doc) => {

    if(doc.length === 0){
      res.send({status: 'Not Found'});
    }else{
      res.send(doc);
    }

 }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('start');
});

module.exports.app = app;
