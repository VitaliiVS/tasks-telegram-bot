const TelegramBot = require('node-telegram-bot-api')
const Task = require('./modules/task')
const ApiCall = require('./modules/apiCall')

const fetch = require('node-fetch')
const uuid = require('./modules/uuid')

const token = ''
const bot = new TelegramBot(token, { polling: true })

const loginUrl = 'http://127.0.0.1:3000/auth'
const tasksUrl = 'http://127.0.0.1:3000/tasks'

let tasksToken = ''

login = async (url, username, password) => {
    const data = {
        'username': username.toLowerCase(),
        'password': password
    }
    const response = await fetch(url, new ApiCall('POST', data))

    if (response.ok) {
        const content = await response.json()
        tasksToken = content.token

        return true
    } else {
        return false
    }
}

getData = async (url, token) => {
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    if (response.ok) {
        const content = await response.json()

        return content
    }
}

postData = async (taskTitle, url, token) => {
    const taskId = uuid()
    const task = new Task(taskId, taskTitle)
    const response = await fetch(url, new ApiCall('POST', task, token))

    if (response.ok) {
        const content = await response.json()

        return content
    } else {
        return
    }
}

bot.onText(/\/login (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const creds = match[1].split(' ')

    const request = await login(loginUrl, creds[0], creds[1])

    if (request) {
        bot.sendMessage(chatId, 'Loged in')
    } else {
        bot.sendMessage(chatId, 'Incorrect login or password')
    }
})

bot.onText(/\/create (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const data = await postData(match[1], tasksUrl, tasksToken)

    if (data !== undefined) {
        let message = 'Your list of tasks:\n'

        for (task of data) {
            if (data.indexOf(task) !== data.length - 1) {
                message += task.taskLabel + ' - ' + `${task.isCompleted ? 'completed' : 'not completed'}` + ',\n'
            } else {
                message += task.taskLabel + ' - ' + `${task.isCompleted ? 'completed' : 'not completed'}` + '.'
            }
        }

        bot.sendMessage(chatId, 'Task Created')
        bot.sendMessage(chatId, message)
    } else {
        bot.sendMessage(chatId, 'Please log in first')
    }
})