const { sendMessage_ } = require("./services/WhatsAppCloudService");
const { creatChatcompletion_,createImage_,} = require("./services/OpenAIService");

const Transcription = require("./Transcription");
const User = require("./User");

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

  const messageTextBody = msg.text?.body;

  if (messageTextBody === "Model") {
    await sendMessage_(from, "interactive_model");
  } else if (messageTextBody === "Language") {
    await sendMessage_(from,"interactive_language");
  } else if (isListMessage(msg)) {
    const listReplyID = msg?.interactive?.list_reply?.id;
    if (listReplyID === "dalle") {
      user.setModel("dalle");
      await sendMessage_(from, "text","You can now send messages to generate images");
    } else if (listReplyID === "chatgpt") {
      user.setModel("chatgpt");
      await sendMessage_(from, "text","You can now send messages to ChatGPT");
    } else if (listReplyID === "ur") {
      user.setLanguage("ur");
      await sendMessage_( from, "text", "آپ اب اس کمپیوٹر پروگرام سے اردو زبان میں بات کرسکتے ہیں۔");
    } else if (listReplyID === "en") {
      user.setLanguage("en");
      await sendMessage_( from, "text","You can now talk to this bot in English");
    }
  } else if (isAudioMessage(msg)) {
    const audioID = msg?.audio.id;
    const botLanguage = user.getLanguage();
    if (user.getModel() === "chatgpt") {
      const transcriptedMessage = await Transcription(audioID, botLanguage);
      const chatGPTResponse = await creatChatcompletion_(
        transcriptedMessage,
        "normalPrompt",
        botLanguage
      );
      await sendMessage_(from, "text",chatGPTResponse);
    } else if (user.getModel() === "dalle") {
      const transcriptedMessage = await Transcription(audioID, "en");
      const dalleResponse = await createImage_(transcriptedMessage);
      await sendMessage_(from, "image" ,dalleResponse);
    }
  } else if (isTextMessage(msg)) {
    const textBody = msg.text?.body;
    const botLanguage = user.getLanguage();

    if (user.getModel() === "chatgpt") {
      const chatGPTResponse = await creatChatcompletion_(textBody,"normalPrompt",botLanguage);
      await sendMessage_(from,  "text", chatGPTResponse);
    } else if (user.getModel() === "dalle") {
      const isEnglish = await creatChatcompletion_(textBody,"languageDetectPrompt");
      if (isEnglish.toLowerCase().includes("yes")) {
        console.log(textBody, "inside yes");
        const dalleResponse = await createImage_(textBody);
        await sendMessage_(from,"image", dalleResponse);
      } else {
        const translatedPromptInEnglish = await creatChatcompletion_(textBody,"translatePromptToEnglish");
        const dalleResponse = await createImage_(translatedPromptInEnglish);
        await sendMessage_(from,  "image", dalleResponse);
      }
    }
  }
}


function isAudioMessage(message) {
  return message?.type === "audio";
}
function isTextMessage(message) {
  return message?.type === "text";
}

function isListMessage(message) {
  return message?.interactive?.type === "list_reply";
}


module.exports = receive;
