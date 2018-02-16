const mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect');
  }else{
    console.log('Connect to mongo');
  }

  const db = client.db('TodoApp');

  db.collection('Todos').deleteOne({name: "Iksan3"}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('error');

  });
  client.close();
});
