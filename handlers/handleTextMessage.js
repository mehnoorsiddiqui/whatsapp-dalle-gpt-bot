const { createChatcompletion ,createImage} = require("../services/OpenAIService");
const { sendMessage} = require("../services/WhatsAppCloudService");

async function handleTextMessage(from, message, userObj) {
    
    const textBody = message.text?.body;
    const botLanguage = userObj.getLanguage();
    const aiModel = userObj.getModel();

    if (aiModel === "chatgpt") {
        const chatGPTResponse = await createChatcompletion(textBody, "normalPrompt", botLanguage);
        await sendMessage(from, "text", chatGPTResponse);
    } else if (aiModel === "dalle") {
        const isEnglish = await createChatcompletion(textBody, "languageDetectPrompt");
        if (isEnglish.toLowerCase().includes("yes")) {
            console.log(textBody, "inside yes");
            const dalleResponse = await createImage(textBody);
            await sendMessage(from, "image", dalleResponse);
        } else {
            const translatedPromptInEnglish = await createChatcompletion(textBody, "translatePromptToEnglish");
            const dalleResponse = await createImage(translatedPromptInEnglish);
            await sendMessage(from, "image", dalleResponse);
        }
    }
}

module.exports = handleTextMessage;