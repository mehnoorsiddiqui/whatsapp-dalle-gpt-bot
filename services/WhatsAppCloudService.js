require("dotenv").config();
const { Client, MessagesController, MediaController } = require('whatsapp-cloud-apilib');

const fetch = require('node-fetch');
const token = process.env.WHATSAPP_ACCESS_TOKEN;

const client = new Client({
  timeout: 0,
  accessToken: token,
  version: 'v16.0'
});

const messagesController = new MessagesController(client);

//send message
const sendMessage = async (from, messageType, text = '') => {
  const phoneNumberID = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const textMessage = text ? text : "Sorry, we could not detect any text in your message.";

  let body = {
    messagingProduct: 'whatsapp',
    to: from
  };

  switch (messageType) {
    case 'text':
      body.type = "text";
      body.text = { body: textMessage }
      break;
    case 'image':
      body.type = "image";
      body.image = { link: textMessage }
      break;
    case 'interactive_model':
        body.type = "interactive";
        body.interactive ={
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
      break;
    case 'interactive_language':
        body.type= "interactive";
        body.interactive= {
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
      break;
    default:
      console.log('This is not a known type');
      break;
  }

  try {
    const { result } = await messagesController.sendMessage(phoneNumberID, body);
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
    throw error
  }
}

module.exports = { sendMessage, downloadAudio };
