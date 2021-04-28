const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const config = require('../../../config.json');

const predict = require('../../../src/commands/general/predict').execute;

const msgMockFactory = (id) => {
  return {
    author: {
      id
    },
    reply: sinon.stub(),
  };
};

const validOutcomes = ['yes', 'no'];

const stateMock = {
  addPrediction: sinon.stub().callsFake((_id, outcome, _bet) => {
    if (!validOutcomes.includes(outcome)) {
      throw new Error('please specify yes or no as an outcome.');
    }
  }),
  isOpen: sinon.stub().returns(true)
};

const modelMock = {
  getPoints: sinon.stub().callsFake((id) => {
    if (id === '456') {
      throw new Error('Invalid ID');
    }

    return 300;
  }),
  setPoints: sinon.stub()
};

describe('predict command', () => {
  beforeEach(() => {
    stateMock.addPrediction.resetHistory();
    modelMock.setPoints.resetHistory();
  });

  it('allow a valid prediction to be made', async () => {
    const msgMock = msgMockFactory('123');
    await predict(msgMock, ['yes', 200], modelMock, stateMock);

    expect(stateMock.addPrediction.callCount).to.eql(1);
    expect(stateMock.addPrediction.firstCall.args).to.eql(['123', 'yes', 200]);

    expect(modelMock.setPoints.callCount).to.eql(1);
    expect(modelMock.setPoints.firstCall.args).to.eql(['123', 100]);

    expect(msgMock.reply.callCount).to.eql(1);
  });

  it('does not allow predictions when they are closed', async () => {
    const msgMock = msgMockFactory('123');
    await predict(msgMock, ['yes', '100'], modelMock, { isOpen: () => false });

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('predictions are closed at the moment.');
  });

  it('does not allow predictions for unregistered users', async () => {
    const msgMock = msgMockFactory('456');
    await predict(msgMock, ['yes', 50], modelMock, stateMock);

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('it appears you have not registered, so you cannot make a prediction.');
  });

  describe('invalid outcome predictions', () => {
    it('does not allow predictions without an outcome specified', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, [], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please specify an outcome.');
    });

    it('does not allow predictions with an invalid outcome', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['foo', 150], modelMock, stateMock);
  
      expect(stateMock.addPrediction.callCount).to.eql(1);
      expect(stateMock.addPrediction.firstCall.args).to.eql(['123', 'foo', 150]);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please specify yes or no as an outcome.');
  
      expect(modelMock.setPoints.callCount).to.eql(0);
    });
  });

  describe('invalid amount predictions', () => {
    it('does not allow predictions without an amount specified', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes'], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please specify how many points you will bet.');
    });

    it('does not allow predictions with a non-integer amount', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes', 'foo'], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please provide an integer for how many points you will bet.');
    });

    it('does not allow predictions with 0 as the amount', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes', 0], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please enter a positive number.');
    });

    it('does not allow predictions with a negative amount', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes', -1], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('please enter a positive number.');
    });

    it('does not allow predictions with a bet larger than config.MAX_BET', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes', config.MAX_BET + 1], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql(`max bet size is ${config.MAX_BET}.`);
    });

    it('does not allow predictions with an amount higher than their point balance', async () => {
      const msgMock = msgMockFactory('123');
      await predict(msgMock, ['yes', 500], modelMock, stateMock);
  
      expect(msgMock.reply.callCount).to.eql(1);
      expect(msgMock.reply.firstCall.args[0]).to.eql('you do not have enough points to make this bet. You have 300 points.');
    });
  });
});
