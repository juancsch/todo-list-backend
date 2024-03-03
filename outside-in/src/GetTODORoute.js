import { IncomingMessage, ServerResponse } from 'http'

import { readFile } from 'fs/promises'

/**
 * @param {import("./Server").Log} log
 * @param {import("./Server").Config} config
 * @returns {import("./Server").Route}
 */
export function GetTODORoute (log, config) {

	const getTODO = GetTODO(log, config)

	return {
		/**
		 * @param {IncomingMessage} request
		 * @returns {boolean}
		 */
		isFor (request) {
			return request.method === 'GET' && /^\/todos\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(request.url)
		},
		/**
		 * @param {IncomingMessage} request
		 * @param {ServerResponse} response
		 * @returns {Promise<void>}
		 */
		async handler (request, response) {
			const id = request.url.split('/').pop()
			log.info('Request TODO', id)
			const todo = await getTODO(id)
			if (todo === undefined) {
				reponseWithNotFound()
				return
			}
			responseWithTODO()

			/**
			 *
			 */
			function responseWithTODO () {
				response.writeHead(200, {
					'Content-Type': 'application/json'
				})
				response.end(JSON.stringify(todo))
			}

			/**
			 *
			 */
			function reponseWithNotFound () {
				response.writeHead(404, {
					'Content-Type': 'application/json'
				})
				response.end(JSON.stringify({ message: `TODO [${id}] not found` }))
			}
		}
	}
}

/**
 * @param {import("./Server").Log} log
 * @param {import("./Server").Config} config
 * @returns {function(string): Promise<{id: string, text: string, done: boolean} | undefined>}
 */
function GetTODO (log, config) {

	log.info('Get TODO from db:', config.dbPath)

	return async (id) => {
		const todos = JSON.parse(await readFile(config.dbPath, 'utf8'))
		return todos.find(todo => todo.id === id)
	}
}
