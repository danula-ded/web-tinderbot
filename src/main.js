const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
    }

    async start(msg) {
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text);
    }

    async hello(msg) {
        const text = msg.text;
        await this.sendText("<b>Пвивет!!</b>");
        await this.sendText("<i>Как дела?</i>");
        await this.sendText(`Вы писали: ${text}`);

        await this.sendImage("avatar_main")

        await this.sendTextButtons("Какая у вас тема в Телеграмм??", {
            "theme_light": "Светлая",
            "theme_dark": "Темная",
        });
    }

    async helloButton(callbackQuery) {
        const query = callbackQuery.data;
        if (query === "theme_light")
            await this.sendText("У вас светлая тема!")
        else if (query === "theme_dark")
            await this.sendText("У вас темная тема!")
    }
}

const bot = new MyTelegramBot("7260252368:AAEDyx_q6PHihKJoC6CJ1by92llFX5WIRNM");
bot.onCommand(/\/start/, bot.start)
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton)