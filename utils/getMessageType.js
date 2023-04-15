function getMessageType(message) {
    if (message?.text?.body === "Model") {
        return "model";
    } else if (message?.text?.body === "Language") {
        return "language";
    } else if (message?.interactive?.type === "list_reply") {
        return "list";
    } else if (message?.type === "audio") {
        return "audio";
    } else if (message?.type === "text") {
        return "text";
    } else {
        return "unknown";
    }
}

module.exports = getMessageType;