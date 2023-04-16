require("dotenv").config();
const { Client, MessagesController, MediaController } = require('whatsapp-cloud-apilib');

const fetch = require('node-fetch');
const token = process.env.WHATSAPP_TOKEN;

const client = new Client({
  timeout: 20000,  //30 sec
  accessToken: process.env.WHATSAPP_TOKEN,
});
const messagesController = new MessagesController(client);

//send message
const sendMessage = async (from, messageType , text = '') => {
  const from_ = from.toString();
  const phoneNumberID_ = process.env.PHONE_NUMBER_ID;
  let textMessage = ' ';

  if (text === undefined || text === null || text.length === 0) {
    textMessage = "Sorry, we were unable to detect any audio in your message. Please make sure your microphone is enabled and try again.";
  } else if (typeof text === 'string') {
    textMessage = text;
  }
  let body;

  switch (messageType) {
    case 'text':
      body = {
        messagingProduct: 'whatsapp',
        to: from_,
        type: "text",
        text: {
          body: textMessage
        }
      };
      break;
    case 'image':
      body = {
        messagingProduct: 'whatsapp',
        to: from_,
        type: "image",
        image: {
          link: textMessage
        }
      };
      break;
    case 'interactive_model':
      body = {
        messagingProduct: 'whatsapp',
        to: from_,
        type: "interactive",
        interactive: {
          action: {
            sections: [
              {
                title: "Select the AI Model",
                rows: [
                  {
                    id: "chatgpt",
                    title: "ChatGPT"
                  },
                  {
                    id: "dalle",
                    title: "DALL-E"
                  }
                ]
              }
            ],
            button: "Models"
          },
          body: {
            text: "Select the AI Model"
          },
          type: "list"
        }
      }
      break;
    case 'interactive_language':
      body = {
        messagingProduct: 'whatsapp',
        to: from_,
        type: "interactive",
        interactive: {
          action: {
            sections: [
              {
                title: "Select the Language",
                rows: [
                  {
                    id: "en",
                    title: "English"
                  },
                  {
                    id: "ur",
                    title: "Urdu"
                  }
                ]
              }
            ],
            button: "Languages"
          },
          body: {
            text: "Select the Language"
          },
          type: "list"
        }
      }
      break;
    default:
      console.log('This is not a known type');
      break;
  }

  try {
    const { result } = await messagesController.sendMessage(phoneNumberID_, body);
    return result;
  } catch (error) {
    console.log(error)
  }
}


const mediaController = new MediaController(client);

const downloadAudio = async (mediaID) => {
  try {
    const { result } = await mediaController.retrieveMediaURL(mediaID);
    const audioURL = result.url;
    const config = { headers: { authorization: `Bearer ${token}` } };
    const audioBinary = await fetch(audioURL, config);
    return audioBinary;

  } catch (error) {
    console.log(error)

  }
}

module.exports = { sendMessage, downloadAudio};
