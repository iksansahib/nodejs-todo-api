var mongoose = require('mongoose');

//mongoose.connect('mongodb://iksansahib:diahcitra85@ds243728.mlab.com:43728/todoapp');
mongoose.connect(process.env.MONGODB_URI);
module.exports = {mongoose};
