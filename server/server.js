const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {ObjectID} = require('mongodb');
var app = express();

//const port = 3000;
const port = process.env.PORT || 3000;

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

app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id).then((doc) => {
    if(!ObjectID.isValid(req.params.id)){
      return res.status(400).send({message: 'Invalid ID'});
    }

    if(doc){
      if(doc.length === 0){
        res.send({status: 'Not Found'});
      }else{
        res.send(doc);
      }
    }else{
      res.send({message: 'Not Found'});
    }
  }).catch((e) => {
    res.status(400).send({message: e.message});
  });
});


app.listen(port, () => {
  console.log('start');
});

module.exports.app = app;
