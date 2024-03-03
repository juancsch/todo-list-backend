import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'

import { createTodoListServer } from '../../src/Server.js'

/**
 *
 * add todo (text, id) - POST /todos { id, text }
 * get one todo - GET /todos/id
 * remove todo - DELETE /todos/id
 * mark as done - PUT /todos { id, text, mark }
 * get all todos - GET /todos
 */

describe('TODO list HTTP Server', async () => {

	const server = createTodoListServer()

	before(async () => {
		await server.start()
	})

	after(async () => {
		await server.stop()
	})

	describe('basic routes', () => {

		test('should response with 404 when path was unknown', async () => {
			const response = await fetch('http://localhost:8080/unknown')
			assert.equal(response.status, 404)
		})

		test('should response with 500 when catch unexpected error', async () => {
			const response = await fetch('http://localhost:8080/')
			assert.equal(response.status, 500)
		})
	})
})
