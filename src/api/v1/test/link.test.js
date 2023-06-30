/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */

const { faker } = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../../app');

const dummyData = {
  name: 'dummyName',
  email: faker.internet.email(),
  password: 'dummyPassword',
  accessToken: '',
  shortUrl: '',
};

describe('Auth Integration Test', () => {
  // jest.setTimeout(30000);
  it('Success Registration', (done) => {
    request(app)
      .post('/v1/auth/register')
      .send({
        name: dummyData.name,
        email: dummyData.email,
        password: dummyData.password,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          dummyData.accessToken = res.body.token.accessToken;
          expect(res.statusCode).toEqual(201);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('token');
          expect(res.body.token).toHaveProperty('accessToken');
          expect(res.body.token).toHaveProperty('refreshToken');
          done();
        }
      });
  });

  it('Success Create Short Link', (done) => {
    request(app)
      .post('/v1/link')
      .set('Authorization', dummyData.accessToken)
      .send({
        title: 'title',
        originalUrl: 'google.com',
        customUrl: dummyData.email,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          dummyData.shortUrl = res.body.data.shortUrl;
          expect(res.statusCode).toEqual(201);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('originalUrl');
          expect(res.body.data).toHaveProperty('shortUrl');
          done();
        }
      });
  });

  it('Duplicate Custom Url at Create Short Link', (done) => {
    request(app)
      .post('/v1/link')
      .set('Authorization', dummyData.accessToken)
      .send({
        title: 'title',
        originalUrl: 'google.com',
        customUrl: dummyData.email,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Success Favorite Short Link', (done) => {
    request(app)
      .patch(`/v1/link/${dummyData.shortUrl}`)
      .set('Authorization', dummyData.accessToken)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Success Update Short Link', (done) => {
    request(app)
      .put('/v1/link')
      .set('Authorization', dummyData.accessToken)
      .send({
        shortUrl: dummyData.shortUrl,
        title: 'title',
        customUrl: dummyData.shortUrl,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Success List Short Link', (done) => {
    request(app)
      .get('/v1/link')
      .set('Authorization', dummyData.accessToken)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('data');
          done();
        }
      });
  });

  it('Success Get Short Link', (done) => {
    request(app)
      .get(`/v1/link/${dummyData.shortUrl}`)
      .set('Authorization', dummyData.accessToken)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('data');
          done();
        }
      });
  });

  it('Success Remove Short Link', (done) => {
    request(app)
      .delete(`/v1/link/${dummyData.shortUrl}`)
      .set('Authorization', dummyData.accessToken)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });
});
