import http, { IncomingMessage, ServerResponse } from 'http'

import { AllTODOsRoute } from './routes/AllTODOsRoute.js'
import { GetTODORoute } from './routes/GetTODORoute.js'

/**
 * @typedef {object} Route
 * @property {function(IncomingMessage): boolean} isFor
 * @property {function(IncomingMessage, ServerResponse): void} handler
 */

/**
 * @param {{
 *   port?: number,
 *   config: import('../Config.js').Config,
 *   log?: import('../Log.js').Log
 * }} args
 * @returns {{
 *   start: function(): Promise<void>,
 *   stop: function(): Promise<void>
 * }}
 */
export function createTodoListServer ({ port = 8080, log = console, config }) {

	const server = http.createServer()
		.on('request', requestHandler(log, config))
		.on('error', (error) => {
			log.error('Server error', error)
		})

	return {
		/**
		 *
		 */
		async start () {
			await new Promise((resolve) => {
				server.listen(port, () => {
					log.info(`Server listening on port ${port}`)
					resolve()
				})
			})
		},
		/**
		 *
		 */
		async stop () {
			await new Promise((resolve, reject) => {
				server.close((err) => {
					if (err !== undefined) reject(err)
					else resolve()
				})
			})
		}
	}
}

/**
 * @param {import('../Log.js').Log} log
 * @param {import('../Config.js').Config} config
 * @returns {function(IncomingMessage, ServerResponse): void}
 */
function requestHandler (log, config) {

	const allTODOsRoute = AllTODOsRoute(log, config)
	const getOneTODO = GetTODORoute(log, config)

	return async (request, response) => {
		try {
			switch (true) {
				case request.method === 'GET' && request.url === '/error':
					errorHandler(request, response)
					break
				case allTODOsRoute.isFor(request):
					await allTODOsRoute.handler(request, response)
					break
				case getOneTODO.isFor(request):
					await getOneTODO.handler(request, response)
					break
				default:
					notFoundHandler(request, response)
			}
		} catch (error) {
			errorHandler(request, response, error)
		}
	}

	/**
	 * @param {IncomingMessage} request
	 * @param {ServerResponse} response
	 */
	function notFoundHandler (request, response) {
		log.info('Not found', request.url)
		response.writeHead(404)
		response.end()
	}

	/**
	 * @param {IncomingMessage} request
	 * @param {ServerResponse} response
	 * @param {Error} [error]
	 */
	function errorHandler (request, response, error) {
		log.error('Error in', request.url, error)
		response.writeHead(500)
		response.end()
	}
}
