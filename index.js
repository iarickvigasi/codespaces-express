
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5732683707:AAEZaQPqymTD12n4fLtmLQn-GoW1N3oK1W';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  let chatId = msg.chat.id;
  let messageText = msg.text;

  // we need to send the response to the openAI text-davinci-003 model
  // before we can send it back to the user
  sendToOpenAi(messageText).then(response => {
    bot.sendMessage(chatId, response);
  });
});

const sendToOpenAi = (messageText) => {
 return new Promise((resolve, reject) => {
   const request = require('request');
   const openAiUrl = 'http://api.openai.com/v1/engines/text-davinci-003/completions';
   const openAiHeaders = {
     'Authorization': 'Bearer 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',
   };
   
   const payload = {
     'prompt': messageText,
     'max_tokens': 10,
     'temperature': 0.6,
     'top_p': 0.9
   };

   const options = {
     url: openAiUrl,
     headers: openAiHeaders,
     body: JSON.stringify(payload)
   };

   request.post(options, (error, response, body) => {
     if (!error && response.statusCode == 200) {
       const result = JSON.parse(body);
       resolve(result.choices[0].text);
     } else {
       reject(error);
     }
   });
 });
}