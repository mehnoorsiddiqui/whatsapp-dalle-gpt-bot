const fs = require("fs");
const { Client, OpenAIController, FileWrapper } = require("openai-apilib");

// Create OpenAI configuration
const client = new Client({
  timeout: 0,
  accessToken: process.env.OPENAI_API_KEY
});

// Create OpenAI API client
const openAIController = new OpenAIController(client);

const createTranscription = async (audioFilePath, aiModel) => {
  const file = new FileWrapper(fs.createReadStream(audioFilePath));
  const model = "whisper-1";
  const prompt =
    aiModel === "chatgpt"
      ? "English Language or اردو زبان"
      : "English Language";
  const responseFormat = "json";
  const temperature = 0;
  const language = aiModel === "dalle" ? "en" : undefined;
  try {
    const { result } = await openAIController.createTranscription(file,model,prompt,responseFormat,temperature,language);
    return result.text;
  } catch (error) {
    throw error;
  }
};

const createImage = async prompt => {
  try {
    const { result } = await openAIController.createImage({
      prompt: `${prompt}`,
      n: 1,
      size: "256x256"
    });
    return result.data[0].url;
  } catch (error) {
    throw error;
  }
};

const createChatcompletion = async (promptMessage, promptType, language) => {
  const lang = language === "en" ? "English" : "Urdu";
  let systemPrompt, prompt;

  if (promptType === "translatePromptToEnglish") {
    systemPrompt = `You are a helpful assistant that translates sentences into English.`;
    prompt = `translate [${promptMessage}]  to English. Do not write any explanation or additional words with the translation. Only Send the translation in the quotation not any other information. 
    If the message is already in English. Just send it in a quotation without explanation else send the translation. My first sentence/word is [${promptMessage} ].`;
  } else if (promptType == "normalPrompt") {
    systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. The number of words in your answer should not exceed 50 words. Answer strictly in ${lang}`;
    prompt = `${promptMessage}`;
  }
  try {
    const { result } = await openAIController.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}`
        },
        { role: "user", content: `${prompt}` }
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2
    });
    return result.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

module.exports = { createTranscription, createImage, createChatcompletion };
