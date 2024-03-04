import assert from 'node:assert/strict'
import { after, before, describe, test } from 'node:test'

import { GetAllTODOs } from '../../src/todos/GetAllTODOs.js'
import * as GetAllTODOsRoute from '../../src/todos/infra/routes/GetAllTODOsRoute.js'
import * as TODOsFileRepository from '../../src/todos/infra/TODOsFileRepository.js'
import * as HttpServer from '../../src/web/Server.js'

/**
 * [] add todo (text, id) - POST /todos { id, text }
 * [] get one todo - GET /todos/id
 * [] remove todo - DELETE /todos/id
 * [] mark as done - PUT /todos { id, text, mark }
 * [X] get all todos - GET /todos
 */

describe('TODO list server', () => {

	const server = HttpServer.create()
	const repository = TODOsFileRepository.create('./nullable/test/e2e/fixtures/todos.json')
	GetAllTODOs(GetAllTODOsRoute.create(server), repository)

	before(async () => {
		await server.start()
	})

	after(async () => {
		await server.stop()
	})

	test('should catch server error: 500', async () => {

		server.addRoute({
			method: 'GET',
			path: '/error',
			/**
			 *
			 */
			handler: () => {
				throw new Error()
			}
		})

		const response = await fetch('http://localhost:8080/error')

		assert.equal(response.status, 500)
		assert.equal(response.statusText, 'Internal Server Error')
	})

	test('should response with not found: 404', async () => {

		const response = await fetch('http://localhost:8080/unknown')

		assert.equal(response.status, 404)
		assert.equal(response.statusText, 'Not Found')
	})

	test('should get all TODOs', async () => {

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
})
