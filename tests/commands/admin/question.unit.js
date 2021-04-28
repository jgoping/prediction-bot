const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const question = require('../../../src/commands/admin/question').execute;

const msgMock = {
  channel: {
    send: sinon.stub(),
  },
  reply: sinon.stub(),
};

const questionArg = 'sample question';

const stateMock = {
  isLive: sinon.stub().returns(false),
  openPredictions: sinon.stub()
};

describe('question command', () => {
  beforeEach(() => {
    stateMock.isLive.resetHistory();
    stateMock.openPredictions.resetHistory();
    msgMock.channel.send.resetHistory();
    msgMock.reply.resetHistory();
  });

  it('opens the predictions if it is not currently live', () => {
    question(msgMock, [questionArg], undefined, stateMock);

    expect(stateMock.isLive.callCount).to.eql(1);
    expect(stateMock.openPredictions.callCount).to.eql(1);

    expect(msgMock.channel.send.callCount).to.eql(1);
    expect(msgMock.channel.send.firstCall.args[0]).to.eql(`Predictions opened! ${questionArg}`);
  });

  it('does not open the predictions if it is currently live', () => {
    question(msgMock, [questionArg], undefined, { isLive: () => true });

    expect(stateMock.openPredictions.callCount).to.eql(0);
    expect(msgMock.reply.callCount).to.eql(1);
  });
});
