const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const close = require('../../../src/commands/admin/close').execute;

const msgMock = {
  channel: {
    send: sinon.stub(),
  },
};

const stateMock = {
  closePredictions: sinon.stub(),
};

describe('close command', () => {
  it('closes the predictions', () => {
    close(msgMock, undefined, undefined, stateMock);

    expect(stateMock.closePredictions.callCount).to.eql(1);
    expect(msgMock.channel.send.callCount).to.eql(1);
  });
});
