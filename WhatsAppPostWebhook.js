const { sendMessage_ } = require("./services/WhatsAppCloudService");
const User = require("./User");
const getMessageType = require("./utils/getMessageType");
const handleListMessage = require("./handlers/handleListMessage");
const handleAudioMessage = require("./handlers/handleAudioMessage");
const handleTextMessage = require("./handlers/handleTextMessage");

const users = [];

function findUser(number) {
  return users.find(user => user.getNumber() === number);
}

function getUserOrCreate(number) {
  let user = findUser(number);
  if (!user) {
    user = new User(number);
    users.push(user);
  }
  return user;
}

async function receive(message) {

  //Ignore ibound notifications / messages  older than 12 min
  const filteredMessages = message.entry[0].changes[0].value.messages.filter(
    (message) => message.timestamp > (Date.now() - 1000 * 60 * 60 * 0.2) / 1000
  );

  const msg = filteredMessages?.[0];

  if (!msg) {
    return;
  }

  const from = msg.from;

  let user = getUserOrCreate(from);
  const messageType = getMessageType(msg);

  switch (messageType) {
    case "model":
      await sendMessage_(from, "interactive_model");
      break;
    case "language":
      await sendMessage_(from, "interactive_language");
      break;
    case "list":
      await handleListMessage(from, msg,user);
      break;
    case "audio":
      await handleAudioMessage(from, msg, user);
      break;
    case "text":
      await handleTextMessage(from, msg, user);
      break;
    default:
      break;
  }
}

module.exports = receive;


