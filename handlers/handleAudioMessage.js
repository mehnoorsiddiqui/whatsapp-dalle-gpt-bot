const Transcription = require("../Transcription");
const { createChatcompletion ,createImage} = require("../services/OpenAIService");
const { sendMessage } = require("../services/WhatsAppCloudService");

async function handleAudioMessage(from, message, userObj) {

    const audioID = message?.audio.id;
    const botLanguage = userObj.getLanguage();
    const aiModel = userObj.getModel();

    if (aiModel === "chatgpt") {
        const transcriptedMessage = await Transcription(audioID ,aiModel);
        const chatGPTResponse = await createChatcompletion(transcriptedMessage, "normalPrompt", botLanguage);
        await sendMessage(from, "text", chatGPTResponse);
    } else if (aiModel === "dalle") {
        const transcriptedMessage = await Transcription(audioID, aiModel);
        const dalleResponse = await createImage(transcriptedMessage);
        await sendMessage(from, "image", dalleResponse);
    }
}

module.exports = handleAudioMessage;