const { sendMessage_ } = require("../services/WhatsAppCloudService");

async function handleListMessage(from, message, userObj) {
   
    const listReplyID = message?.interactive?.list_reply?.id;
    if (listReplyID === "dalle") {
        userObj.setModel("dalle");
        await sendMessage_(from, "text", "You can now send messages to generate images");
    } else if (listReplyID === "chatgpt") {
        userObj.setModel("chatgpt");
        await sendMessage_(from, "text", "You can now send messages to ChatGPT");
    } else if (listReplyID === "ur") {
        userObj.setLanguage("ur");
        await sendMessage_(from, "text", "آپ اب اس کمپیوٹر پروگرام سے اردو زبان میں بات کرسکتے ہیں۔");
    } else if (listReplyID === "en") {
        userObj.setLanguage("en");
        await sendMessage_(from, "text", "You can now talk to this bot in English");
    }
}

module.exports = handleListMessage;