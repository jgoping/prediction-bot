const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const result = require('../../../src/commands/admin/result').execute;

const msgMock = {
  channel: {
    send: sinon.stub(),
  },
  reply: sinon.stub(),
};

const outcome = 'yes';

const modelMock = {
  getUser: sinon.stub().resolves({ username: 'foo', points: 300}),
  setPoints: sinon.stub()
};

const stateMock = {
  clearPredictions: sinon.stub(),
  closePredictions: sinon.stub(),
  getPredictions: sinon.stub().callsFake((outcome) => {
    return outcome === 'yes' ? [{ id: '123', amount: 50 }] : [{ id: '456', amount: 100 }]
  }),
  isLive: sinon.stub().returns(true)
};

describe('result command', () => {
  beforeEach(() => {
    msgMock.reply.resetHistory();
    stateMock.clearPredictions.resetHistory();
    stateMock.closePredictions.resetHistory();
    stateMock.getPredictions.resetHistory();
    stateMock.isLive.resetHistory();
    modelMock.getUser.resetHistory();
    modelMock.setPoints.resetHistory();
  });

  it('stops the current prediction and pays out to the participants', async () => {
    await result(msgMock, [outcome], modelMock, stateMock);

    expect(stateMock.isLive.callCount).to.eql(1);

    expect(stateMock.getPredictions.callCount).to.eql(1);
    expect(stateMock.getPredictions.firstCall.args[0]).to.eql(outcome);

    expect(msgMock.channel.send.callCount).to.eql(2);
    expect(msgMock.channel.send.firstCall.args[0]).to.eql(`The prediction result is: ${outcome}!`);

    expect(stateMock.closePredictions.callCount).to.eql(1);

    expect(modelMock.getUser.callCount).to.eql(1);

    expect(modelMock.setPoints.callCount).to.eql(1);
    expect(modelMock.setPoints.firstCall.args).to.eql(['123', 400]);
    expect(msgMock.channel.send.secondCall.args[0]).to.eql('foo has won and now has 400 points!');

    expect(stateMock.clearPredictions.callCount).to.eql(1);
  });

  it('does not pay out to the participants if no prediction is live', async () => {
    await result(msgMock, [outcome], modelMock, { ...stateMock, isLive: () => false });

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('there is no live prediction at the moment.');

    expect(stateMock.getPredictions.callCount).to.eql(0);
    expect(stateMock.closePredictions.callCount).to.eql(0);
    expect(modelMock.getUser.callCount).to.eql(0);
    expect(modelMock.setPoints.callCount).to.eql(0);
    expect(stateMock.clearPredictions.callCount).to.eql(0);
  });

  it('does not pay out to the participants if no outcome is specified', async () => {
    await result(msgMock, [], modelMock, stateMock);

    expect(stateMock.isLive.callCount).to.eql(1);

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('please specify an outcome.');

    expect(stateMock.getPredictions.callCount).to.eql(0);
    expect(stateMock.closePredictions.callCount).to.eql(0);
    expect(modelMock.getUser.callCount).to.eql(0);
    expect(modelMock.setPoints.callCount).to.eql(0);
    expect(stateMock.clearPredictions.callCount).to.eql(0);
  });
});
