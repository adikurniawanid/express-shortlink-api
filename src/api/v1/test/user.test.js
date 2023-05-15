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

  it('Success Get Detail User', (done) => {
    request(app)
      .get('/v1/user/me')
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
          expect(res.body.data).toHaveProperty('publicId');
          expect(res.body.data).toHaveProperty('email');
          expect(res.body.data).toHaveProperty('name');
          done();
        }
      });
  });

  it('Success Update Password', (done) => {
    request(app)
      .put('/v1/user/update-password')
      .set('Authorization', dummyData.accessToken)
      .send({
        oldPassword: dummyData.password,
        verificationPassword: dummyData.password,
        newPassword: dummyData.password,
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
});
