import { createTodoListServer } from './web/Server.js'

const listenPort = process.env.PORT || '8080'

const todoListServer = createTodoListServer({
	port: Number(listenPort),
	config: {
		dbPath: 'todos.json'
	}
})
todoListServer.start().catch(console.error)

process.on('SIGINT', () => {
	todoListServer.stop().catch(console.error)
})
