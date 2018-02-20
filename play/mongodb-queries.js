const {ObjectID} = require('mongodb');
var {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '5a89ce61d056892592def1ba';

Todo.find({
  _id: id
}).then((todos) => {
  console.log(todos);
});


Todo.findOne({
  _id: id
}).then((todos) => {
  console.log(todos);
});

Todo.findById(id).then((todos) => {
  console.log(todos);
});
