const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");
const API = require("../security")

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
    }

    // Обработчик команды /start
    async start(msg) {
        this.mode = "main";
        const text = this.loadMessage("main")
        await this.sendImage("main")
        await this.sendText(text);

        // Добавляем меню
        await this.showMainMenu({
            "start": "Начать",
            "profile": "генерация Tinder-профиля 😎",
            "opener": "сообщение для знакомства 🥰",
            "message": "переписка от вашего имени 😈",
            "date": "переписка со звездами 🔥",
            "gpt": "ОБщаемся с ИИ",
            "html": "Демонстрация html в виде img",
        })
    }

    async html(msg) {
        await this.sendHTML('<h3 style="color:#1558b0">Привет</h3>')
        const html = this.loadHtml("main")
        await this.sendHTML(html, { theme: "dark" })
    }

    async gpt(msg) {
        this.mode = "qpt";
        const text = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(text)
    }

    async gptDialog(msg) {
        const text = msg.text;
        const answer = chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.sendText(answer)
    }

    // функция ответа на любое текстовые сообщения
    async hello(msg) {
        if (this.mode === "gpt") {
            await this.gptDialog(msg)
        }
        else {
            const text = msg.text;
            await this.sendText("<b>Привет!!</b>");
            await this.sendText("<i>Как дела?</i>");
            await this.sendText(`Вы писали: ${text}`);

            await this.sendImage("avatar_main")

            await this.sendTextButtons("Какая у вас тема в Телеграм??", {
                "theme_light": "Светлая",
                "theme_dark": "Темная",
            });
        }
    }

    // функция обработки кнопок
    async helloButton(callbackQuery) {
        const query = callbackQuery.data;
        if (query === "theme_light")
            await this.sendText("У вас светлая тема!")
        else if (query === "theme_dark")
            await this.sendText("У вас темная тема!")
    }
}

const chatgpt = new ChatGptService(`${API.GPT}`)
const bot = new MyTelegramBot(`${API.TG}`);

bot.onCommand(/\/start/, bot.start) //  /start
bot.onCommand(/\/html/, bot.html) //  /html
bot.onCommand(/\/gpt/, bot.gpt) //  /gpt 
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^.*/, bot.helloButton)