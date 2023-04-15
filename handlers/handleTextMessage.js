const { creatChatcompletion_ ,createImage_} = require("../services/OpenAIService");
const { sendMessage_ } = require("../services/WhatsAppCloudService");

async function handleTextMessage(from, message, userObj) {
    
    const textBody = message.text?.body;
    const botLanguage = userObj.getLanguage();
    const aiModel = userObj.getModel();

    if (aiModel === "chatgpt") {
        const chatGPTResponse = await creatChatcompletion_(textBody, "normalPrompt", botLanguage);
        await sendMessage_(from, "text", chatGPTResponse);
    } else if (aiModel === "dalle") {
        const isEnglish = await creatChatcompletion_(textBody, "languageDetectPrompt");
        if (isEnglish.toLowerCase().includes("yes")) {
            console.log(textBody, "inside yes");
            const dalleResponse = await createImage_(textBody);
            await sendMessage_(from, "image", dalleResponse);
        } else {
            const translatedPromptInEnglish = await creatChatcompletion_(textBody, "translatePromptToEnglish");
            const dalleResponse = await createImage_(translatedPromptInEnglish);
            await sendMessage_(from, "image", dalleResponse);
        }
    }
}

module.exports = handleTextMessage;