const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const register = require('../../../src/commands/general/register').execute;

const msgMockFactory = (id) => {
  return {
    author: {
      id
    },
    reply: sinon.stub(),
  };
};

const modelMock = {
  isRegistered: sinon.stub().callsFake((id) => id === '456'),
  setUser: sinon.stub(),
};

describe('register command', () => {
  beforeEach(() => {
    modelMock.isRegistered.resetHistory();
    modelMock.setUser.resetHistory();
  });

  it('should register a new user', async () => {
    const msgMock = msgMockFactory('123');
    await register(msgMock, undefined, modelMock, undefined);

    expect(modelMock.isRegistered.callCount).to.eql(1);
    expect(modelMock.isRegistered.firstCall.args).to.eql(['123']);

    expect(modelMock.setUser.callCount).to.eql(1);
    expect(msgMock.reply.callCount).to.eql(1);
  });

  it('should not register an existing user', async () => {
    const msgMock = msgMockFactory('456');
    await register(msgMock, undefined, modelMock, undefined);

    expect(modelMock.isRegistered.callCount).to.eql(1);
    expect(modelMock.isRegistered.firstCall.args).to.eql(['456']);

    expect(modelMock.setUser.callCount).to.eql(0);
    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args).to.eql(['it appears you have already registered!']);
  });
});
