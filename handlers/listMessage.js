const { sendMessage } = require("../services/WhatsAppCloudService");

async function handleListMessage(from, message, userObj) {
    const listReplyID = message?.interactive?.list_reply?.id;

    switch (listReplyID) {
        case "dalle":            
            userObj.setModel("dalle");
            await sendMessage(from, "text", "You can now send messages to generate images");
            break;
        case "chatgpt":
            userObj.setModel("chatgpt");
            await sendMessage(from, "text", "You can now send messages to ChatGPT");
            break;
        case "ur":
            userObj.setLanguage("ur");
            await sendMessage(from, "text", "آپ اب اس کمپیوٹر پروگرام سے اردو زبان میں بات کرسکتے ہیں۔");
            break;
        case "en":
            userObj.setLanguage("en");
            await sendMessage(from, "text", "You can now talk to this bot in English");
            break;
        default:
            break;
    }
}

module.exports = handleListMessage;