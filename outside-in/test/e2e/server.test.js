import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'

import { createTodoListServer } from '../../src/Server.js'

/**
 * [] add todo (text, id) - POST /todos { id, text }
 * [X] get one todo - GET /todos/id
 * [] remove todo - DELETE /todos/id
 * [] mark as done - PUT /todos { id, text, mark }
 * [X] get all todos - GET /todos
 */

describe('TODO list HTTP Server', async () => {

	const server = createTodoListServer({
		config: {
			dbPath: './outside-in/test/e2e/fixtures/todos.json'
		}
	})

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
			const response = await fetch('http://localhost:8080/error')
			assert.equal(response.status, 500)
		})
	})

	describe('todos', () => {

		test('should get all todos', async () => {
			const response = await fetch('http://localhost:8080/todos')

			assert.equal(response.status, 200)
			assert.deepEqual(await response.json(), [{
				id: '367af223-0499-4203-90ae-c3fa4ad3351e',
				text: 'todo 1',
				done: false
			}, {
				id: '7e7fec93-4911-4025-b5bd-b62a0f95285d',
				text: 'todo 2',
				done: true
			}, {
				id: '2dd08285-40d7-4863-82e4-4dd5692d5fa6',
				text: 'todo 2',
				done: false
			}])
		})

		test('should get one todo', async () => {
			const response = await fetch('http://localhost:8080/todos/367af223-0499-4203-90ae-c3fa4ad3351e')

			assert.equal(response.status, 200)
			assert.deepEqual(await response.json(), {
				id: '367af223-0499-4203-90ae-c3fa4ad3351e',
				text: 'todo 1',
				done: false
			})
		})

		test('should return 404 when todo not found', async () => {
			const response = await fetch('http://localhost:8080/todos/367af223-0499-4203-90ae-c3fa4ad3351f')

			assert.equal(response.status, 404)
			assert.deepEqual(await response.json(), {
				message: 'TODO [367af223-0499-4203-90ae-c3fa4ad3351f] not found'
			})
		})
	})
})
