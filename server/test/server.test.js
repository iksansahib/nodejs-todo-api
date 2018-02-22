const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken')
const {app} = require('./../server.js');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {populateUser, user, populateTodos, todos} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUser);

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
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(todos[0]._id.toHexString());
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

describe('DELETE /todos/:id', () => {
  it('should get todo by ID', (done) => {

    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(todos[0]._id.toHexString());
      })
      .end((err, result) => {
        done(err);
    });
  });
  it('should catch error when invalid ID or todo not exist', () => {
    request(app)
      .delete('/todos/000')
      .expect(400)
      .expect((res) => {
        expect(res.message).toInclude('message');
      })
      .end((err,result) => done(err));
  });
});

describe('PATCH /todos/:id', () => {
  it('should get todo by ID', (done) => {
    var text = 'unit test patch';
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, result) => {
        done(err);
    });
  });
  it('should catch error when invalid ID or todo not exist', () => {
    request(app)
      .delete('/todos/000')
      .expect(400)
      .expect((res) => {
        expect(res.message).toInclude('message');
      })
      .end((err,result) => done(err));
  });
});

describe('GET /user/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/user/me')
      .set('x-auth', user[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(user[0]._id.toHexString());
        expect(res.body.email).toBe(user[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/user/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /user', () => {
  it('should return x-auth header and user if valid', (done) => {
    const objectID = new ObjectID();
    const newUser = [{
      _id: objectID,
      email: 'emailnew@email.com',
      password: 'emailnew',
      tokens: [{
        access: 'auth',
        token: jwt.sign({_id: objectID, access: 'auth'}, 'abc123').toString()
      }]
    }];
    request(app)
      .post('/user')
      .send(newUser[0])
      .expect(200)
      .expect((res) => {
        User.findByToken(res.header['x-auth']).then((user) => {
          expect(res.header['x-auth']).toBe(user.tokens[0].token);
          expect(res.body._id).toEqual(user._id.toHexString());
        });
      })
      .end(done);
  });

  it('should return 400 bad req if user post not valid', (done) => {
    const objectID = new ObjectID();
    const newUser = [{
      _id: objectID,
      email: 'emailnew@email.com',
      password: 'emailnew',
      tokens: [{
        access: 'auth',
        token: jwt.sign({_id: objectID, access: 'auth'}, 'abc123').toString()
      }]
    }];

    request(app)
      .post('/user')
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
      })
      .end(done);
  });
});