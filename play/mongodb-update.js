const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
mongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect');
  }else{
    console.log('Connect to mongo');
  }

  const db = client.db('TodoApp');
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5a870cb1801a1d149247eb3b")
  }, {
    $set: {
      name: 'Iksan update'
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });

  client.close();

});
