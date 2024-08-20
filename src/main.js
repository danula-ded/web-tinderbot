const { HtmlTelegramBot, userInfoToString } = require("./bot");
const ChatGptService = require("./gpt");
const API = require("../security")

class MyTelegramBot extends HtmlTelegramBot {
    constructor(token) {
        super(token);
        this.mode = null;
        this.list = [];
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
        this.mode = "gpt";
        const text = this.loadMessage("gpt")
        await this.sendImage("gpt")
        await this.sendText(text)
    }

    async gptDialog(msg) {
        const myMessage = await this.sendText("Так много вопросов \n и так мало ответов....")
        const text = msg.text;
        const answer = await chatgpt.sendQuestion("Ответь на вопрос", text)
        await this.editText(myMessage, answer)
    }

    async date(msg) {
        this.mode = "date"
        const text = this.loadMessage("date")
        await this.sendImage("date")
        await this.sendTextButtons(text, {
            "date_grande": "Ариана Гранде",
            "date_robbie": "Марго Робби",
            "date_zendaya": "Зендея",
            "date_gosling": "Райн Гослинг",
            "date_hardy": "Том Харди",
        })
    }

    async dateButton(callbackQuery) {
        const query = callbackQuery.data;
        await this.sendImage(query)
        await this.sendText("Отличный выбор! Пригласи девушку / парня на свидание за 5 сообщений:")

        const prompt = this.loadPrompt(query)
        chatgpt.setPrompt(prompt)
    }

    async dateDialog(msg) {
        const text = msg.text;
        const myMessage = await this.sendText("Набирает текст....")
        const answer = await chatgpt.addMessage(text)
        await this.editText(myMessage, answer)
    }

    async message(msg) {
        this.mode = "message";
        const text = this.loadMessage("message")
        await this.sendImage("message")
        await this.sendTextButtons(text, {
            "message_next": "Следующее сообщение",
            "message_date": "Пригласить на свидание",
        })
    }

    async messageButton(callbackQuery) {
        const myMessage = await this.sendText("Как бы сделать лучше....")
        const query = callbackQuery.data;
        const prompt = this.loadPrompt(query)
        const userChatHistory = this.list.join("\n\n")
        const answer = await chatgpt.sendQuestion(prompt, userChatHistory)
        await this.editText(myMessage, answer)
    }

    async messageDialog(msg) {
        const text = msg.text;
        this.list.push(text)
    }

    // функция ответа на любое текстовые сообщения
    async hello(msg) {
        if (this.mode === "gpt") {
            await this.gptDialog(msg)
        }
        else if (this.mode === "date") {
            await this.dateDialog(msg)
        }
        else if (this.mode === "message") {
            await this.messageDialog(msg)
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
bot.onCommand(/\/date/, bot.date) //  /date 
bot.onCommand(/\/message/, bot.message) //  /message 
bot.onTextMessage(bot.hello)
bot.onButtonCallback(/^date_.*/, bot.dateButton)
bot.onButtonCallback(/^message_.*/, bot.messageButton)
bot.onButtonCallback(/^.*/, bot.helloButton)