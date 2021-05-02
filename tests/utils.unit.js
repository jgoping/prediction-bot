const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const messageHandler = require('../src/utils').messageHandler;

const commandMap = new Map();
commandMap.set('!predict', {
  adminRequired: false,
  execute: sinon.stub()
});
commandMap.set('!question', {
  adminRequired: true,
  execute: sinon.stub()
});

const botMock = {
  commands: commandMap
};

const botMsgMock = {
  author: {
    bot: true
  },
  reply: sinon.stub()
};

const msgMockFactory = (id, content) => {
  return {
    author: {
      id
    },
    content,
    reply: sinon.stub()
  };
};

const modListMock = ['123'];

describe('message handler', () => {
  beforeEach(() => {
    botMsgMock.reply.resetHistory();
    for (const command of commandMap.values()) {
      command.execute.resetHistory();
    }
  });

  it('executes the command if it is valid', async () => {
    const msgMock = msgMockFactory('123', '!predict yes 100');
    messageHandler(botMock, msgMock, undefined, undefined, modListMock);

    expect(msgMock.reply.callCount).to.eql(0);
    expect(commandMap.get('!predict').execute.callCount).to.eql(1);
  });

  it('allows moderators to run moderator commands', async () => {
    const msgMock = msgMockFactory('123', '!question Will this command get run?');
    await messageHandler(botMock, msgMock, undefined, undefined, modListMock);

    expect(msgMock.reply.callCount).to.eql(0);
    expect(commandMap.get('!question').execute.callCount).to.eql(1);
  });

  it('does not allow non-moderators to run moderator commands', async () => {
    const msgMock = msgMockFactory('456', '!question Will this command get run?');
    await messageHandler(botMock, msgMock, undefined, undefined, modListMock);

    expect(msgMock.reply.callCount).to.eql(1);
    expect(msgMock.reply.firstCall.args[0]).to.eql('you are not authorized to execute this command.');
    expect(commandMap.get('!question').execute.callCount).to.eql(0);
  });

  it('returns if the message was sent by the bot', async () => {
    await messageHandler(botMock, botMsgMock, undefined, undefined, modListMock);

    expect(botMsgMock.reply.callCount).to.eql(0);
    expect(commandMap.get('!predict').execute.callCount).to.eql(0);
    expect(commandMap.get('!question').execute.callCount).to.eql(0);
  });

  it('returns if the command does not exist', async () => {
    const msgMock = msgMockFactory('123', '!foo');
    await messageHandler(botMock, msgMock, undefined, undefined, modListMock);

    expect(botMsgMock.reply.callCount).to.eql(0);
    expect(commandMap.get('!predict').execute.callCount).to.eql(0);
    expect(commandMap.get('!question').execute.callCount).to.eql(0);
  });
});
