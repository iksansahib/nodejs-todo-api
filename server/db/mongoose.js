var mongoose = require('mongoose');

//mongoose.connect('mongodb://iksansahib:diahcitra85@ds243728.mlab.com:43728/todoapp');
mongoose.connect('mongodb://localhost:27017/TodoApp');
module.exports = {mongoose};
