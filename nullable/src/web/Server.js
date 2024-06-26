import http, { IncomingMessage, ServerResponse } from 'node:http'

/**
 * @typedef {object} HttpServer
 * @property {function(): Promise<void>} start
 * @property {function(): Promise<void>} stop
 * @property {function(Route): void} addRoute
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

	// for testing proposals
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
			const actualRoute = routes.find(byRoute)
			if (actualRoute !== undefined) {
				await actualRoute.handler(request, response)
				return
			}
			notFoundHandler(request, response)
		} catch (err) {
			errorHandler(request, response, err)
		}

		/**
		 * @param {Route} route
		 * @returns {boolean}
		 */
		function byRoute (route) {
			const paths = request.url.split('/')
			return route.method === request.method && route.path === `/${paths[1]}`
		}

		/**
		 * @param {IncomingMessage} request
		 * @param {ServerResponse} response
		 */
		function notFoundHandler (request, response) {
			log.info('Not found', request.url)
			response.writeHead(404, {
				'Content-Type': 'application/json'
			})
			response.end(JSON.stringify({
				message: `Not found [${request.url}]`
			}))
		}

		/**
		 * @param {IncomingMessage} request
		 * @param {ServerResponse} response
		 * @param {Error} [error]
		 */
		function errorHandler (request, response, error) {
			log.error('Error in', request.url, error)
			response.writeHead(500, {
				'Content-Type': 'application/json'
			})
			response.end(JSON.stringify({
				message: `ERROR when request [${request.url}]`
			}))
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
		 * @returns {Array<{status: number, payload: Array<import("../todos/application/GetAllTODOs.js/index.js").TODO>}>}
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
				status, payload: payload === undefined ? undefined : JSON.parse(payload)
			})
		}
	}
}
