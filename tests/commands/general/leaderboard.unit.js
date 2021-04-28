const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const leaderboard = require('../../../src/commands/general/leaderboard').execute;

const msgMock = {
  channel: {
    send: sinon.stub(),
  },
};

const modelMock = {
  getLeaderboard: sinon.stub().resolves([
    { username: 'foo', points: 1 },
    { username: 'bar', points: 2 },
  ])
};

const expectedOutput = 'Leaderboard:\nfoo: 1\nbar: 2';

describe('leaderboard command', () => {
  it('should get the leaderboard from the model', async () => {
    await leaderboard(msgMock, undefined, modelMock, undefined);

    expect(modelMock.getLeaderboard.callCount).to.eql(1);

    expect(msgMock.channel.send.callCount).to.eql(1);
    expect(msgMock.channel.send.firstCall.args[0]).to.eql(expectedOutput);
  });
});
