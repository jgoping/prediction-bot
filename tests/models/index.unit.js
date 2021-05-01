const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const mysql = require('mysql');
const util = require('util');

const Model = require('../../src/models/mysql').model;
const { queryMap,
  IS_REGISTERED_QUERY_1,
  IS_REGISTERED_QUERY_2,
  GET_USER_QUERY_1,
  GET_USER_QUERY_2,
  SET_USER_QUERY,
  GET_POINTS_QUERY_1,
  GET_POINTS_QUERY_2,
  SET_POINTS_QUERY,
  GET_LEADERBOARD_QUERY, 
  GET_USER_RESULT_1,
  GET_POINTS_RESULT_1,
  GET_LEADERBOARD_RESULT } = require('./fixtures');

chai.use(chaiAsPromised);

const dbStub = {
  connect: sinon.stub(),
  query: sinon.stub().callsFake((query) => queryMap.get(query))
};

const mySqlStub = sinon.stub(mysql, 'createConnection').returns(dbStub);
const utilStub = sinon.stub(util, 'promisify').callsFake((fn) => fn);

describe('model class', () => {
  describe('constructor', () => {
    it('sets this.query correctly', () => {
      const model = new Model();

      expect(mySqlStub.callCount).to.eql(1);
      expect(dbStub.connect.callCount).to.eql(1);
      expect(utilStub.callCount).to.eql(1);

      expect(model).to.include.keys('query');
    });
  });

  describe('methods', () => {
    let model;
    beforeEach(() => {
      dbStub.query.resetHistory();

      model = new Model();
    });

    describe('isRegistered() method', () => {
      it('returns true for a registered user', async () => {
        const result = await model.isRegistered('123');
  
        expect(dbStub.query.firstCall.args[0]).to.eql(IS_REGISTERED_QUERY_1);
        expect(result).to.eql(true);
      });
  
      it('returns false for a non-registered user', async () => {
        const result = await model.isRegistered('456');
  
        expect(dbStub.query.firstCall.args[0]).to.eql(IS_REGISTERED_QUERY_2);
        expect(result).to.eql(false);
      });
    });
  
    describe('getUser() method', () => {
      it('returns the username and points for a registered user', async () => {
        const result = await model.getUser('123');

        expect(dbStub.query.firstCall.args[0]).to.eql(GET_USER_QUERY_1);
        expect(result).to.eql(GET_USER_RESULT_1[0]);
      });
  
      it('throws an error if the ID is invalid', async () => {
        await expect(model.getUser('456')).to.be.rejectedWith(Error);

        expect(dbStub.query.firstCall.args[0]).to.eql(GET_USER_QUERY_2);
      });
    });

    describe('setUser() method', () => {
      it('runs the set user query', async () => {
        await model.setUser('789', 'bar', 200);

        expect(dbStub.query.firstCall.args[0]).to.eql(SET_USER_QUERY);
      });
    });

    describe('getPoints() method', () => {
      it('returns the points for a registered user', async () => {
        const result = await model.getPoints('123');

        expect(dbStub.query.firstCall.args[0]).to.eql(GET_POINTS_QUERY_1);
        expect(result).to.eql(GET_POINTS_RESULT_1[0].points);
      });
  
      it('throws an error if the ID is invalid', async () => {
        await expect(model.getPoints('456')).to.be.rejectedWith(Error);

        expect(dbStub.query.firstCall.args[0]).to.eql(GET_POINTS_QUERY_2);
      });
    });

    describe('setPoints() method', () => {
      it('runs the set points query', async () => {
        await model.setPoints('789', 300);

        expect(dbStub.query.firstCall.args[0]).to.eql(SET_POINTS_QUERY);
      });
    });

    describe('getLeaderboard() method', () => {
      it('returns the username and points of all users', async () => {
        const result = await model.getLeaderboard();

        expect(dbStub.query.firstCall.args[0]).to.eql(GET_LEADERBOARD_QUERY);
        expect(result).to.eql(GET_LEADERBOARD_RESULT);
      });
    });
  });
});
