const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const refund = require('../../../src/commands/admin/refund').execute;

const msgMock = {
  channel: {
    send: sinon.stub(),
  },
  reply: sinon.stub(),
};

const modelMock = {
  getPoints: sinon.stub().resolves(300),
  setPoints: sinon.stub()
};

const stateMock = {
  clearPredictions: sinon.stub(),
  closePredictions: sinon.stub(),
  getPredictions: sinon.stub().returns([
    { id: '123', amount: 50 },
    { id: '456', amount: 100 },
  ]),
  isLive: sinon.stub().returns(true)
};

describe('refund command', () => {
  beforeEach(() => {
    stateMock.clearPredictions.resetHistory();
    stateMock.closePredictions.resetHistory();
    stateMock.getPredictions.resetHistory();
    modelMock.getPoints.resetHistory();
    modelMock.setPoints.resetHistory();
  });

  it('stops the current prediction and refunds the participants', async () => {
    await refund(msgMock, undefined, modelMock, stateMock);

    expect(stateMock.isLive.callCount).to.eql(1);

    expect(msgMock.channel.send.callCount).to.eql(1);
    expect(msgMock.channel.send.firstCall.args[0]).to.eql('The prediction is cancelled and the points have been refunded.');

    expect(stateMock.closePredictions.callCount).to.eql(1);
    expect(stateMock.getPredictions.callCount).to.eql(1);

    expect(modelMock.getPoints.callCount).to.eql(2);

    expect(modelMock.setPoints.callCount).to.eql(2);
    expect(modelMock.setPoints.firstCall.args).to.eql(['123', 350]);
    expect(modelMock.setPoints.secondCall.args).to.eql(['456', 400]);

    expect(stateMock.clearPredictions.callCount).to.eql(1);
  });

  it('does not refund the participants if no prediction is live', async () => {
    await refund(msgMock, undefined, modelMock, { ...stateMock, isLive: () => false });

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('there is no live prediction at the moment.');

    expect(stateMock.closePredictions.callCount).to.eql(0);
    expect(stateMock.getPredictions.callCount).to.eql(0);
    expect(modelMock.getPoints.callCount).to.eql(0);
    expect(modelMock.setPoints.callCount).to.eql(0);
    expect(stateMock.clearPredictions.callCount).to.eql(0);
  });
});
