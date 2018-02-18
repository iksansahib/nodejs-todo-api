const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');

const {Todo} = require('./../models/todo');

const todos = [{
  text: 'test1 todo'
},{
  text: 'test2'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});


describe('POST /todos', () => {

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

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get todo', (done) => {

    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        if(res.body.status==='Not Found'){
          done('Not Found');
        }
        expect(res.body.length).toBe(2);
        done();
      })
      .end((err, result) => {
        if(err){
          return done(err);
        }
     });
  });
});
