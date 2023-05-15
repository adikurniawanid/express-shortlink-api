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
  refreshToken: '',
  googleIdToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc3NzBiMDg1YmY2NDliNzI2YjM1NzQ3NjQwMzBlMWJkZTlhMTBhZTYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTM4MTc5NzI2NDMwMDQwNDEyMTMiLCJlbWFpbCI6ImFkaWt1cm5pYXdhbi5kZXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiI1dEcyV0lLTmhqbkdlZkQ5dUNZbE9RIiwibmFtZSI6IkFkaSBLdXJuaWF3YW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WUVsMEY0Q1NMVjVUUnpSWFlrU2dsSlNFUnZRZjhOTGFHdUU0VVlfZz1zOTYtYyIsImdpdmVuX25hbWUiOiJBZGkiLCJmYW1pbHlfbmFtZSI6Ikt1cm5pYXdhbiIsImxvY2FsZSI6ImlkIiwiaWF0IjoxNjg0MTE1OTY5LCJleHAiOjE2ODQxMTk1Njl9.SYtWd4CXH3hns0rFC-G5KdOMjoZOAhwKHqESqo_F0x_GunC53BJcN79gIiYbgHacfah-09wNmb5NQPBB4lIExQLhyoQ_vADgR7eDGfOEZ3xX8-l7paWJUCDD25lpr1j677tlOJwVo8yPxQoHUQjGwYbfdMSDhi9oaip-6btV5VS4di8hJXV9OZ_4y_4aFG4ySqfJADdr4po69IZJopIfKwqJWR2WH4OuQpQmKOQEoYnYtbs1L_NUMpTCKIdjBuCGkUCO_YtKBWulHlrsID9J5VyKtaKQ8Qn-iTBjHiZMNGki7vq3Ist5TpfczAZBA9XiD0N4aGkCjJbrbHIIAKes9A',
};

describe('Auth Integration Test', () => {
  // jest.setTimeout(40000);
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

  it('Duplicate Email at Registration', (done) => {
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
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('errors');
          done();
        }
      });
  });

  it('Validation Registration', (done) => {
    request(app)
      .post('/v1/auth/register')
      .send({
        email: 'dummyData.email',
        password: 'dummyData.password',
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('errors');
          done();
        }
      });
  });

  it('Success Login', (done) => {
    request(app)
      .post('/v1/auth/login')
      .send({
        email: dummyData.email,
        password: dummyData.password,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          dummyData.refreshToken = res.body.token.refreshToken;
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('publicId');
          expect(res.body.data).toHaveProperty('name');
          expect(res.body).toHaveProperty('token');
          expect(res.body.token).toHaveProperty('accessToken');
          expect(res.body.token).toHaveProperty('refreshToken');
          done();
        }
      });
  });

  it('Validation Login', (done) => {
    request(app)
      .post('/v1/auth/login')
      .send({
        email: 'dummyData.email',
        password: 'dummyData.password',
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('errors');
          done();
        }
      });
  });

  it('Unauthorized Login', (done) => {
    request(app)
      .post('/v1/auth/login')
      .send({
        email: dummyData.email,
        password: 'dummy.password',
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Success Refresh Token', (done) => {
    request(app)
      .post('/v1/auth/refresh-token')
      .send({
        refreshToken: dummyData.refreshToken,
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          dummyData.accessToken = res.body.token.accessToken;
          expect(res.statusCode).toEqual(200);
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

  it('Invalid Refresh Token', (done) => {
    request(app)
      .post('/v1/auth/refresh-token')
      .send({
        refreshToken: (dummyData.refreshToken).replace('a', 'b'),
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Failed Refresh Token', (done) => {
    request(app)
      .post('/v1/auth/refresh-token')
      .send({
        refreshToken: 'dummyData.refreshToken',
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(401);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          done();
        }
      });
  });

  it('Success Login with Google', (done) => {
    request(app)
      .post('/v1/auth/login-with-google')
      .send({
        googleIdToken: dummyData.googleIdToken,
      })
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
          expect(res.body.data).toHaveProperty('name');
          expect(res.body).toHaveProperty('token');
          expect(res.body.token).toHaveProperty('accessToken');
          expect(res.body.token).toHaveProperty('refreshToken');
          done();
        }
      });
  });

  it('Validation Login with Google', (done) => {
    request(app)
      .post('/v1/auth/login-with-google')
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toHaveProperty('id');
          expect(res.body.message).toHaveProperty('en');
          expect(res.body).toHaveProperty('errors');
          done();
        }
      });
  });

  it('Success Send Forgot Password Token', (done) => {
    request(app)
      .post('/v1/auth/forgot-password')
      .send({
        email: dummyData.email,
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
  }, 70000);

  it('Email For Forgot Password Token Not Exists', (done) => {
    request(app)
      .post('/v1/auth/forgot-password')
      .send({
        email: 'dummyData.email',
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
});
