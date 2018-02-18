const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');

const {Todo} = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
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
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todos with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .expect((res) => {
        console.log(res.body.text);
        expect(res.body.text).toBe(undefined);
      })
      .end((err, result) => {
        if(err){
          return done(err);
       }

       done();
      });
  });
});
