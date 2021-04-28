const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const balance = require('../../../src/commands/general/balance').execute;

const msgMockFactory = (id) => {
  return {
    author: {
      id
    },
    reply: sinon.stub(),
  };
};

const modelMock = {
  getPoints: sinon.stub().callsFake((id) => {
    if (id === '456') {
      throw new Error('Invalid ID');
    }

    return 300;
  })
};

describe('balance command', () => {
  beforeEach(() => {
    modelMock.getPoints.resetHistory();
  });

  it('should give the balance of a registered user', async () => {
    const msgMock = msgMockFactory('123');
    await balance(msgMock, undefined, modelMock, undefined);

    expect(modelMock.getPoints.callCount).to.eql(1);
    expect(modelMock.getPoints.firstCall.args).to.eql(['123']);

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args).to.eql(['you currently have 300 points.'])
  });

  it('should not give the balance of an unregistered user', async () => {
    const msgMock = msgMockFactory('456');
    await balance(msgMock, undefined, modelMock, undefined);

    expect(modelMock.getPoints.callCount).to.eql(1);
    expect(modelMock.getPoints.firstCall.args).to.eql(['456']);

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args).to.eql(['it appears you have not registered, so you do not have a balance.'])
  });
});
