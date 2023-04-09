const { sendMessage_ } = require("./services/WhatsAppCloudService");
const { creatChatcompletion_ , createImage_} = require("./services/OpenAIService");

const Transcription = require("./Transcription");
const Model = require("./model");
const Language = require("./language");

const aiModel = new Model();
const userLanguage = new Language();


async function receive(message) {
  // const msg = message.entry?.[0]?.changes?.[0].value.messages?.[0];
  
    //filter out inbound webhook notifications to make sure they are not older than 12 min
    const filteredMessages = message.entry[0].changes[0].value.messages.filter((message) => message.timestamp > (Date.now() - 1000 * 60 * 60 * 0.2)/1000);
   
    const msg = filteredMessages?.[0];
    if (msg !== undefined && msg !== null) {
    const from = msg.from;
  
    const messageTextBody = msg.text?.body;
    
    if(messageTextBody === "model" || messageTextBody === "Model"){
      await sendMessage_(from, '',"interactive_model");   
    }
    else if(messageTextBody === "language" || messageTextBody === "Language"){
      await sendMessage_(from, '',"interactive_language");   
    }  
    else if(isListMessage(msg)){
      const listReplyID= msg?.interactive?.list_reply?.id;
      if( listReplyID === "dalle"){
        aiModel.setModel("dalle");
        await sendMessage_(from, "You can now send messages to generate images","text");   
      }
      else if( listReplyID === "chatgpt"){
        aiModel.setModel("chatgpt");
        await sendMessage_(from, "You can now send messages to ChatGPT", "text");   
      }
      else if( listReplyID === "ur"){
        userLanguage.setLanguage("ur");
        await sendMessage_(from,"آپ اب اس کمپیوٹر پروگرام سے اردو زبان میں بات کرسکتے ہیں۔", "text");   
      }
      else if( listReplyID === "en"){
        userLanguage.setLanguage("en");
        await sendMessage_(from, "You can now talk to this bot in English", "text");   
      }
     
    }
   else if(isAudioMessage(msg)){
    const audioID = msg?.audio.id;
    const botLanguage = userLanguage.getLanguage();
      if(aiModel.getModel() === "chatgpt"){
        const transcriptedMessage = await Transcription( audioID,botLanguage);        
        const chatGPTResponse =  await creatChatcompletion_(transcriptedMessage,"normalPrompt",botLanguage);
        await sendMessage_(from, chatGPTResponse,"text");  
      }
      else if(aiModel.getModel() === "dalle"){
        const transcriptedMessage = await Transcription( audioID ,"en");        
        const dalleResponse = await createImage_(transcriptedMessage);
        await sendMessage_(from, dalleResponse, "image");  
      }
    }
    else if(isTextMessage(msg)){
      const textBody=  msg.text?.body;
      const botLanguage = userLanguage.getLanguage();

      if(aiModel.getModel() === "chatgpt"){          
        const chatGPTResponse =  await creatChatcompletion_(textBody,"normalPrompt",botLanguage);
        await sendMessage_(from, chatGPTResponse ,"text");  
      }
      else if(aiModel.getModel() === "dalle"){        
        const isEnglish =  await creatChatcompletion_(textBody, "languageDetectPrompt");
        if (isEnglish.includes("Yes")) {
          const dalleResponse = await createImage_(textBody);
          await sendMessage_(from, dalleResponse ,"image");  
        } else {
        const translatedPromptInEnglish =  await creatChatcompletion_(textBody, "translatePromptToEnglish");
          const dalleResponse = await createImage_(translatedPromptInEnglish);
          await sendMessage_(from, dalleResponse ,"image");  
        }
        
      }
    }
  }
}

function isAudioMessage(message) {
  return (
    message?.type === "audio"
  );
}
function isTextMessage(message) {
  return (
    message?.type === "text"
  );
}

function isListMessage(message) {
  return (
    message?.interactive?.type === "list_reply"
  );
}

// function isReplyMessage(receivedMessage) {
//   const message =
//     receivedMessage?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
//   return (
//     message?.type === "interactive" &&
//     message?.interactive?.type === "button_reply"
//   );
// }

  
// function isInteractiveMessage(receivedMessage) {
//   const message =
//     receivedMessage?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
//   return (
//     message?.type === "interactive" 
//   );
//}

module.exports = receive;
