import assert from 'node:assert'
import { after, before, describe, test } from 'node:test'

import { createTodoListServer } from '../../src/todoListServer.js'

/**
 * add todo (text, id)
 *   POST /todos { id, text }
 * get one todo
 *   GET /todos/id
 * remove todo
 *   DELETE /todos/id
 * mark as done
 *   PUT /todos { id, text, mark }
 * get all todos
 *   GET /todos
 */

describe('HTTP Server', async () => {

	const server = createTodoListServer()

	before(async () => {
		await server.start()
	})

	after(async () => {
		await server.stop()
	})

	test('should response with 404 when path was unknown', async () => {
		const response = await fetch('http://localhost:8080/unknown')
		assert.equal(response.status, 404)
	})

	test('should response with 500 when ...', async () => {
		const response = await fetch('http://localhost:8080/')
		assert.equal(response.status, 500)
	})
})
