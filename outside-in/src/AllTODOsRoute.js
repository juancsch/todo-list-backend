import { IncomingMessage, ServerResponse } from 'http'

import { readFile } from 'fs/promises'

/**
 * @param {import("./Server").Log} log
 * @param {import("./Server").Config} config
 * @returns {import("./Server").Route}
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

/**
 * @param {import("./Server").Log} log
 * @param {import("./Server").Config} config
 * @returns {function(): Promise<{id: string, text: string, done: boolean}[]>}
 */
function GetAllTODOs (log, config) {

	log.info('Get all TODOs from db:', config.dbPath)

	return async () => {
		return JSON.parse(await readFile(config.dbPath, 'utf8'))
	}
}
