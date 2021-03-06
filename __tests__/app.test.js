require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line

      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });


      test('returns todo for Jon', async() => {

        const expectation = [
          {
            'id': 4,
            'todo': 'laundry',
            'completed': false,
            'owner_id': 2
          },
          {
            'id': 5,
            'todo': 'chop onions',
            'completed': false,
            'owner_id': 2
          },
          {
            'id': 6,
            'todo': 'drink water',
            'completed': false,
            'owner_id': 2
          },
        ];
  
        await fakeRequest(app)
          .post('/api/todo')
          .send(expectation[0])
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
  
        await fakeRequest(app)
          .post('/api/todo')
          .send(expectation[1])
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
  
        await fakeRequest(app)
          .post('/api/todo')
          .send(expectation[2])
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
  
        const data = await fakeRequest(app)
          .get('/api/todo')
          .set('Authorization', token)
          .expect('Content-Type', /json/)
          .expect(200);
          
        expect(data.body).toEqual(expectation);


      });

      test('returns completed updated to true for Jon\'s item', async() => {


      const expectation = {
        'id': 4,
        'todo': 'laundry',
        'completed': true,
        'owner_id': 2
      };

      const data = await fakeRequest(app)
        .put('/api/todo/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      console.log(data.body[0])
      console.log(expectation)
      expect(data.body[0]).toEqual(expectation);
    });
  });
});
