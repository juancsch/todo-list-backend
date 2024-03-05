import { IncomingMessage, ServerResponse } from 'http'

import { GetTODO } from '../../todos/GetTODO.js'

/**
 * @param {import("../../Log.js").Log} log
 * @param {import("../../Config.js").Config} config
 * @returns {import("../Server").Route}
 */
export function GetTODORoute (log, config) {

	const getTODO = GetTODO(log, config.dbPath)

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
				reponseWithNotFound(id, response)
				return
			}
			responseWithTODO(todo, response)
		}
	}

	/**
	 * @param {{id: string, text: string, done: boolean}} todo
	 * @param {ServerResponse} response
	 */
	function responseWithTODO (todo, response) {
		response.writeHead(200, {
			'Content-Type': 'application/json'
		})
		response.end(JSON.stringify(todo))
	}

	/**
	 * @param {string} id
	 * @param {ServerResponse} response
	 */
	function reponseWithNotFound (id, response) {
		response.writeHead(404, {
			'Content-Type': 'application/json'
		})
		response.end(JSON.stringify({ message: `TODO [${id}] not found` }))
	}
}
