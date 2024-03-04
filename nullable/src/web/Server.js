import http, { IncomingMessage, ServerResponse } from 'node:http'

/**
 * @typedef {object} HttpServer
 * @property {function(): Promise<void>} start
 * @property {function(): Promise<void>} stop
 * @property {function(Route): void} addRoute
 * @property {function(function(): Promise<Array<import("../todos/GetAllTODOs.js").TODO>>): void} addGetAllTODOs
 */

/**
 * @typedef {object} Route
 * @property {string} method
 * @property {string} path
 * @property {function(IncomingMessage, ServerResponse): void} handler
 */

/**
 * @typedef {object} HttpServerNullable
 * @property {function(Request): void} simulateRequest
 * @property {function(): any} trackerResponses
 */

/**
 * @typedef {object} Request
 * @property {string} method
 * @property {string} path
 */

/**
 * @param {number} [port]
 * @returns {HttpServer}
 */
export function create (port = 8080) {
	return HttpServer(port)
}

/**
 * @returns {HttpServer & HttpServerNullable}
 */
export function createNull () {
	return HttpServer(8080)
}

/**
 * @param {number} port
 * @param {import('node:http')} [_http]
 * @param {import('node:console')} [log]
 * @returns {HttpServer & HttpServerNullable}
 */
function HttpServer (port, _http = http, log = console) {

	const trackerResponses = TrackerResponses()

	const server = _http.createServer()
		.on('error', log.error)
		.on('request', handleRequest)

	const routes = []

	return {
		/**
		 * @returns {Promise<void>}
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
		 * @returns {Promise<void>}
		 */
		async stop () {
			await new Promise((resolve, reject) => {
				server.close((err) => {
					if (err !== undefined) reject(err)
					else resolve()
				})
			})
		},
		/**
		 * @param {Route} route
		 */
		addRoute (route) {
			addRoute(route)
		},
		/**
		 * @param {function(): Promise<Array<import("../todos/GetAllTODOs.js").TODO>>} getAllTODOs
		 */
		addGetAllTODOs (getAllTODOs) {
			addRoute({
				method: 'GET',
				path: '/todos',
				/**
				 * @param {IncomingMessage} request
				 * @param {ServerResponse} response
				 */
				handler: async (request, response) => {
					const allTODOs = await getAllTODOs()
					response.writeHead(200, {
						'Content-Type': 'application/json'
					})
					response.end(JSON.stringify(allTODOs))
				}
			})
		},
		// for testing proposals
		/**
		 * @param {Request} request
		 * @returns {Promise<void>}
		 */
		async simulateRequest (request) {
			let responseStatus = 0
			await handleRequest({
				method: request.method,
				url: request.path
			}, {
				/**
				 * @param {number} status
				 */
				writeHead: (status) => {
					responseStatus = status
				},
				/**
				 * @param {any} payload
				 */
				end: (payload) => {
					trackerResponses.trackResponse(responseStatus, payload)
				}
			})
		},
		/**
		 * @returns {any}
		 */
		trackerResponses () {
			return trackerResponses.getResponses()
		}
	}

	/**
	 * @param {Route} route
	 */
	function addRoute (route) {
		routes.push(route)
	}

	/**
	 * @param {IncomingMessage} request
	 * @param {ServerResponse} response
	 */
	async function handleRequest (request, response) {
		try {
			const actualRoute = routes.find((route) => route.method === request.method && route.path === request.url)
			if (actualRoute) {
				await actualRoute.handler(request, response)
				return
			}

			notFoundHandler(request, response)

		} catch (err) {
			errorHandler(request, response, err)
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
}

/**
 * @returns {{
 *   getResponses: function(): any,
 *   trackResponse: function(number, any): void
 * }}
 */
function TrackerResponses () {

	const responses = []

	return {
		/**
		 * @returns {Array<{status: number, payload: Array<import("../todos/GetAllTODOs.js").TODO>}>}
		 */
		getResponses () {
			return responses
		},
		/**
		 * @param {number} status
		 * @param {string} payload
		 */
		trackResponse (status, payload) {
			responses.push({
				status, payload: JSON.parse(payload)
			})
		}
	}
}
