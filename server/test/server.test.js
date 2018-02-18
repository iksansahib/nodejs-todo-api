const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');

const {Todo} = require('./../models/todo');

var id = "";

describe('POST /todos', () => {
  beforeEach((done) => {
    Todo.remove({}).then(() => done());
  });

  it('should not create todos with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .expect((res) => {
         expect(res.body.text).toBe(undefined);
      })
      .end((err, result) => {
        if(err){
          return done(err);
       }

       done();
      });
  });

 it('should create new todo', (done) => {
    var text = 'test todo';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, result) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          id = todos[0].id;
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get todo', (done) => {
    var newTodo = new Todo({text: 'from test'});
    newTodo.save().then((doc) => {
      id = doc._id;
    });

    request(app)
      .get('/todos')
      .send({id: id})
      .expect(200)
      .expect((res) => {
        if(res.body.status==='Not Found'){
          done('Not Found');
        }
        console.log(res);
        expect(res.body._id).toBe(id);
        done();
      })
      .end((err, result) => {
        if(err){
          return done(err);
        }
     });
  });

  it('should not get todos with invalid id', (done) => {
    request(app)
      .get('/todos')
      .send({})
      .expect(400)
      .expect((res) => {
       expect(res.body.error).toBe('CastError');
      })
      .end((err, result) => {
        if(err){
          return done(err);
       }
       done();
      });
  });
});
