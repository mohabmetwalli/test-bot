import 'dotenv/config'
// Recommended Bot API framework by Telegram: https://core.telegram.org/bots/tutorial#introduction
import { Bot } from 'grammy'
import OpenAI from 'openai'
import { MongoClient } from 'mongodb'

const setUser = () => {
	const user = {
		telegramID: '',
		telegramMessage: '',
		chatGPTResponse: ''
	}

	return user
}

const getResponseFromChatGPT = async (messageFromTelegram) => {
	const chatGPT = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY
	})

	const messageParameters = {
		messages: [{ role: 'user', content: messageFromTelegram }],
		model: 'gpt-3.5-turbo'
	};

	const chatGPTResponse = await chatGPT.chat.completions.create(messageParameters)

	return chatGPTResponse
}

const saveConversationToMongoDB = async ({ 
	telegramID,
	telegramMessage,
	chatGPTResponse
}) => {
	const mongoDBClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

	const mongoDBResponse = await mongoDB.db('testbot').collection('testbot-collection').insertOne({
		userid: telegramID,
		prompt: telegramMessage,
		response: chatGPTResponse
	})
}

const motherJob = async () => {
	try {
		const user = setUser()

		const telegramBot = new Bot(process.env.TELEGRAM_TOKEN)

		telegramBot.on("message:text", async (ctx) => {
			user.telegramID = ctx.from.id
			user.telegramMessage = ctx.message.text
			user.chatGPTResponse = 'Message received.' // await getResponseFromChatGPT(user.telegramMessage) 
			await saveConversationToMongoDB(user)
			ctx.reply(user.chatGPTResponse)
		})

		telegramBot.start()

	} catch (error) {
		console.log(error)
	}
}

motherJob()
