const {HtmlTelegramBot, userInfoToString} = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    // Мы будем писать тут наш код
}

const bot = new MyTelegramBot("TELEGRAM_BOT_TOKEN");
// Мы будем писать тут наш код