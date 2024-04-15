import { IncomingMessage, ServerResponse } from 'http'

import * as HttpServer from '../../../web/Server.js'

/**
 * @typedef {object} GetTODORoute
 * @property {function(function(string): Promise<import("../../domain/TODO.js").TODO>): void} onGetTODO
 */

/**
 * @param {{addRoute: function(import('../../../web/Server.js').Route): void}} server
 * @returns {GetTODORoute}
 */
export function create (server) {
	return GetTODORoute(server)
}

/**
 * @param {{addRoute: function(import('../../../web/Server.js').Route): void}} server
 * @returns {GetTODORoute}
 */
function GetTODORoute (server) {
	return {
		/**
		 * @param {function(string): Promise<import("../../domain/TODO.js").TODO>} getTODO
		 */
		onGetTODO (getTODO) {
			const getTODORoute = {
				method: 'GET',
				path: '/todos',
				/**
				 * @param {IncomingMessage} request
				 * @param {ServerResponse} response
				 */
				handler: async (request, response) => {
					const id = request.url.split('/').pop()
					const todo = await getTODO(id)
					if (todo === undefined) {
						responseWith(404, { message: `TODO [${id}] not found` })
						return
					}
					responseWith(200, todo)

					/**
					 * @param {number} status
					 * @param {any} payload
					 */
					function responseWith (status, payload) {
						response.writeHead(status, {
							'Content-Type': 'application/json'
						})
						response.end(JSON.stringify(payload))
					}
				}
			}
			server.addRoute(getTODORoute)
		}
	}
}

/**
 * @returns {GetTODORoute & {
 *   simulateRequest: function(string): Promise<void>,
 *   trackerResponses: function(): Array<{status: number, payload: import("../../domain/TODO.js").TODO}>
 * }}
 */
export function createNull () {
	const serverNullable = HttpServer.createNull()
	const getTODORoute = GetTODORoute(serverNullable)
	return {
		onGetTODO: getTODORoute.onGetTODO,
		/**
		 * @param {string} id
		 */
		async simulateRequest (id) {
			await serverNullable.simulateRequest({
				method: 'GET',
				path: `/todos/${id}`
			})
		},
		/**
		 * @returns {Array<{status: number, payload: import("../../domain/TODO.js").TODO}>}
		 */
		trackerResponses () {
			return serverNullable.trackerResponses()
		}
	}
}
