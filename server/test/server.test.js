const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');

const {Todo} = require('./../models/todo');

const todos = [{
  text: 'test1 todo'
},{
  text: 'test2'
}];

var id;
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then((todos) => {
    id = todos[0]._id.toHexString();
    done();
  });
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

  describe('GET /todos/:id', () => {
    it('should get todo by ID', (done) => {

      request(app)
        .get(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(id);
        })
        .end((err, result) => {
          done(err);
      });
    });
    it('should catch error when invalid ID or todo not exist', () => {
      request(app)
        .get('/todos/000')
        .expect(400)
        .expect((res) => {
          expect(res.message).toInclude('message');
        })
        .end((err,result) => done(err));
    });
  });



