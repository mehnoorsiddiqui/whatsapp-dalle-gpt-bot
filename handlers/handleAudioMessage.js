const Transcription = require("../Transcription");
const { creatChatcompletion_ ,createImage_} = require("../services/OpenAIService");
const { sendMessage_ } = require("../services/WhatsAppCloudService");

async function handleAudioMessage(from, message, userObj) {

    const audioID = message?.audio.id;
    const botLanguage = userObj.getLanguage();
    const aiModel = userObj.getModel();

    if (aiModel === "chatgpt") {
        const transcriptedMessage = await Transcription(audioID ,aiModel);
        const chatGPTResponse = await creatChatcompletion_(transcriptedMessage, "normalPrompt", botLanguage);
        await sendMessage_(from, "text", chatGPTResponse);
    } else if (aiModel === "dalle") {
        const transcriptedMessage = await Transcription(audioID, aiModel);
        const dalleResponse = await createImage_(transcriptedMessage);
        await sendMessage_(from, "image", dalleResponse);
    }
}

module.exports = handleAudioMessage;