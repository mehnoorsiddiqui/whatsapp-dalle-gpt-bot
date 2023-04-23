const { createChatcompletion, createImage } = require("../services/OpenAIService");
const { sendMessage } = require("../services/WhatsAppCloudService");

async function handleTextMessage(from, message, userObj) {
    const textBody = message.text?.body;
    const botLanguage = userObj.getLanguage();
    const aiModel = userObj.getModel();

    try {
        if (aiModel === "chatgpt") {
            const chatGPTResponse = await createChatcompletion(textBody, "normalPrompt", botLanguage);
            await sendMessage(from, "text", chatGPTResponse);
        } else if (aiModel === "dalle") {
            const translatedPromptInEnglish = await createChatcompletion(textBody, "translatePromptToEnglish");
            const regex = /"([^"]*)"/;
            const match = regex.exec(translatedPromptInEnglish);
            const dallePrompt = match ? match[1] : translatedPromptInEnglish;
            const dalleResponse = await createImage(dallePrompt);
            await sendMessage(from, "image", dalleResponse);
        }

    } catch (error) {
        console.log(error, "text");

        await sendMessage(
            from,
            "text",
            " Sorry, we could not complete your request at this time. Please try again later or contact support if the problem persists."
        );
    }
}

module.exports = handleTextMessage;
