require('./../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var {authenticate} = require('./../middleware/authenticate');
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

app.delete('/todos/:id', (req, res) => {
  Todo.findByIdAndRemove(req.params.id).then((doc) => {
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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text']);
  if(!ObjectID.isValid(req.params.id)){
    return res.status(400).send({message: 'Invalid ID'});
  }

  if(body.text){
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((doc) => {
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
      res.status(400).send({message: 'Bad request'});
    });
  }else{
    res.status(400).send({message: 'Text required'});
  }
});

app.post('/user', (req, res) => {
  var body = _.pick(req.body, ['email','password']);
  var newUser = new User(body);

  newUser.save().then(() => {
    return newUser.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(newUser);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/user/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.listen(port, () => {
  console.log('start');
});

module.exports.app = app;
