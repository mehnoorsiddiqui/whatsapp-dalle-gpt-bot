const fs = require("fs");
const { Client, OpenAIController, FileWrapper } = require("openai-apilib");

// Create OpenAI configuration
const client = new Client({
  timeout: 0,
  accessToken: process.env.OPENAI_API_KEY,
});

// Create OpenAI API client
const openAIController = new OpenAIController(client);

const createTranscription_ = async (audioFilePath, language) => {
  const file = new FileWrapper(fs.createReadStream(audioFilePath));
  const model = "whisper-1";
  const prompt = "? . ; , ";
  const responseFormat = "json";
  const temperature = 0;
  const lang = language;
  try {
    const { result } = await openAIController.createTranscription(
      file,
      model,
      prompt,
      responseFormat,
      temperature,
      lang
    );

    return result.text;
  } catch (error) {
    console.log(error);
  }
};

const createImage_ = async (prompt) => {
  try {
    console.log(prompt, "inside createImage");
    const { result } = await openAIController.createImage({
      prompt: `${prompt}`,
      n: 1,
      size: "256x256",
    });
    return result.data[0].url;
  } catch (error) {
    console.error(error);
  }
};

const creatChatcompletion_ = async (promptMessage, promptType, language) => {
  let lang = language === "en" ? "English" : "Urdu";
  let systemPrompt;
  let prompt;
  if (promptType === "languageDetectPrompt") {
    systemPrompt = `You are a helpful assistant that knows English. You have the ability to check if the sentence is in English or not.`;
    prompt = `act as a  English language detector. Just detect if the following sentence is in English or not.The sentence is ${promptMessage}. Answer in YES or NO only. Do not write any explanations. `;
  } else if (promptType === "translatePromptToEnglish") {
    systemPrompt = `You are a helpful assistant that translates sentences into English.`;
    prompt = `translate [${promptMessage} ] to English. Do not include any description.  Just the translated sentence with quotations`;
  } else if (promptType == "normalPrompt") {
    systemPrompt = `You are ChatGPT, a large language model trained by OpenAI. The number of words in your answer should not exceed 50 words. Answer strictly in ${lang}`;
    prompt = `${promptMessage}`;
  }
  console.log(systemPrompt);
  console.log(prompt);
  try {
    const { result } = await openAIController.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}`,
        },
        { role: "user", content: `${prompt}` },
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 0.5,
      frequency_penalty: 0.5,
      presence_penalty: 0.2,
    });
    return result.choices[0].message.content;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createTranscription_, createImage_, creatChatcompletion_ };
