import http, { IncomingMessage, ServerResponse } from 'http'

/**
 * @typedef {object} Log
 * @property {function(...any): void} info
 * @property {function(...any): void} error
 */

/**
 * @param {number} [port]
 * @param {Log} [log]
 * @returns {{
 *   start: function(): Promise<void>,
 *   stop: function(): Promise<void>
 * }}
 */
export function createTodoListServer (port = 8080, log = console) {

	const server = http.createServer()
		.on('request', requestHandler(log))
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
 * @param {Log} log
 * @returns {function(IncomingMessage, ServerResponse): void}
 */
function requestHandler (log) {

	return (request, response) => {
		try {
			switch (request.url) {
				case '/':
					errorHandler(request, response)
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
