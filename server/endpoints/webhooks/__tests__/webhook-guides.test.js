/* global describe beforeEach it */
const express = require('express');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const supertest = require('supertest');
const bodyParser = require('body-parser');

const {
  fullScale,
  masterMergedPR,
  masterNotMergedPR,
  masterPROpen,
  notMasterMergedPR
} = require('./webhookPayloads');

describe('POST /guides', () => {
  let updateGuidesStub, app, route, request;
  beforeEach(function() {
    updateGuidesStub = sinon.stub();
    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    route = proxyquire('../webhook-guides', {
      '../../../data-push/update/guides': { updateGuides: updateGuidesStub }
    });
    route(app);
    request = supertest(app);
  });
  it('should respond with a 400 when req.body is empty', done => {
    request
      .post('/guides')
      .send({})
      .expect(400, done);
  });

  it('should not call update when PR is opened', done => {
    request
      .post('/guides')
      .send(masterPROpen)
      .expect(() => {
        if (updateGuidesStub.called) {
          throw new Error('guide update called!');
        }
      })
      .expect(200, done);
  });

  it('should not call update when PR is closed and not merged', done => {
    request
      .post('/guides')
      .send(masterNotMergedPR)
      .expect(200)
      .expect(() => {
        if (updateGuidesStub.called) {
          throw new Error('guide update called!');
        }
      })
      .end(done);
  });

  it('should not call update when PR is merged on a different branch', done => {
    request
      .post('/guides')
      .send(notMasterMergedPR)
      .expect(200)
      .expect(() => {
        if (updateGuidesStub.called) {
          throw new Error('guide update called!');
        }
      })
      .end(done);
  });

  it('should call update when PR is merged on master', done => {
    request
      .post('/guides')
      .send(masterMergedPR)
      .expect(200)
      .expect(() => {
        if (!updateGuidesStub.called) {
          throw new Error("guide update wasn't called!");
        }
      })
      .end(done);
  });

  it('should call update when PR is merged on master, FULL SCALE', done => {
    request
      .post('/guides')
      .send(fullScale)
      .expect(200)
      .expect(() => {
        if (!updateGuidesStub.called) {
          throw new Error("guide update wasn't called!");
        }
      })
      .end(done);
  });
});
