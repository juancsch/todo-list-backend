import { IncomingMessage, ServerResponse } from 'http'

import { GetAllTODOs } from '../../todos/GetAllTODOs.js'

/**
 * @param {import("../../Log.js").Log} log
 * @param {import("../../Config.js").Config} config
 * @returns {import("../Server").Route}
 */
export function AllTODOsRoute (log, config) {

	const getAllTODOs = GetAllTODOs(log, config)

	return {
		/**
		 * @param {IncomingMessage} request
		 * @returns {boolean}
		 */
		isFor (request) {
			return request.method === 'GET' && request.url === '/todos'
		},
		/**
		 * @param {IncomingMessage} request
		 * @param {ServerResponse} response
		 * @returns {Promise<void>}
		 */
		async handler (request, response) {
			log.info('Request all TODOs ...')
			const allTODOs = await getAllTODOs()
			response.writeHead(200, {
				'Content-Type': 'application/json'
			})
			response.end(JSON.stringify(allTODOs))
		}
	}
}
