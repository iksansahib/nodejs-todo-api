const mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
  if(err){
    return console.log('Unable to connect');
  }else{
    console.log('Connect to mongo');
  }

  const db = client.db('TodoApp');
/*
 *  db.collection('Todos').insertOne({
 *    name: 'Iksan3',
 *    age: 32,
 *    address: 'Jakarta'
 *  }, (err, res) => {
 *    if(err){
 *      return console.log('Unable to insert');
 *    }
 *
 *    console.log(JSON.stringify(res, undefined, 2));
 *  });
 */
  db.collection('Todos').find({name: "Iksan2"}).toArray().then((docs) => {
    /*
     *console.log(`Todos: ${count}`);
     */
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('error');

  });
  client.close();
});
