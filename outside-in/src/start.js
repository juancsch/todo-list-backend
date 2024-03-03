import { createTodoListServer } from './Server.js'

const listenPort = process.env.PORT || '8080'

const todoListServer = createTodoListServer(Number(listenPort))
todoListServer.start().catch(console.error)

process.on('SIGINT', () => {
	todoListServer.stop().catch(console.error)
})
