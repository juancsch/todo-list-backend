import assert from 'node:assert'
import { describe, test } from 'node:test'

import { GetAllTODOs } from '../../src/todos/application/GetAllTODOs.js'
import { GetTODO } from '../../src/todos/application/GetTODO.js'
import * as GetAllTODOsRoute from '../../src/todos/infra/routes/GetAllTODOsRoute.js'
import * as GetTODORoute from '../../src/todos/infra/routes/GetTODORoute.js'
import * as TODOsFileRepository from '../../src/todos/infra/TODOsFileRepository.js'

describe('TODO list behaviour', () => {

	test('should get all TODOs from store', async () => {
		// Given
		const route = GetAllTODOsRoute.createNull()
		const todos = [{
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
		}]
		const repository = TODOsFileRepository.createNull(todos)

		// When
		GetAllTODOs(route, repository)
		await route.simulateRequest()

		// Then
		const response = route.trackerResponses()[0]
		assert.equal(response.status, 200)
		assert.deepEqual(response.payload, todos)
	})

	test('should get one TODO from store', async () => {
		// Given
		const route = GetTODORoute.createNull()
		const todos = [{
			id: '367af223-0499-4203-90ae-c3fa4ad3351e',
			text: 'todo 1',
			done: false
		}]
		const repository = TODOsFileRepository.createNull(todos)

		// When
		GetTODO(route, repository)
		await route.simulateRequest('367af223-0499-4203-90ae-c3fa4ad3351e')

		// Then
		const response = route.trackerResponses()[0]
		assert.equal(response.status, 200)
		assert.deepEqual(response.payload, todos[0])
	})

	test('should request a TODO that not exists', async () => {
		// Given
		const route = GetTODORoute.createNull()
		const repository = TODOsFileRepository.createNull([])

		// When
		GetTODO(route, repository)
		await route.simulateRequest('367af223-0499-4203-90ae-c3fa4ad3351f')

		// Then
		const response = route.trackerResponses()[0]
		assert.equal(response.status, 404)
		assert.deepEqual(response.payload, {
			message: 'TODO [367af223-0499-4203-90ae-c3fa4ad3351f] not found'
		})
	})
})
