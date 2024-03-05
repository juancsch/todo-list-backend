import { IncomingMessage, ServerResponse } from 'http'

import * as HttpServer from '../../../web/Server.js'

/**
 * @typedef {object} GetAllTODOsRoute
 * @property {function(function(): Promise<Array<import("../../domain/TODO.js").TODO>>): void} addGetAllTODOs
 */

/**
 * @param {{addRoute: function(import('../../../web/Server.js').Route): void}} server
 * @returns {GetAllTODOsRoute}
 */
export function create (server) {
	return GetAllTODOsRoute(server)
}

/**
 * @param {{addRoute: function(import('../../../web/Server.js').Route): void}} server
 * @returns {GetAllTODOsRoute}
 */
function GetAllTODOsRoute (server) {
	return {
		/**
		 * @param {function(): Promise<Array<import("../../domain/TODO.js").TODO>>} getAllTODOs
		 */
		addGetAllTODOs (getAllTODOs) {
			const getAllTODOsRoute = {
				method: 'GET',
				path: '/todos',
				/**
				 * @param {IncomingMessage} _
				 * @param {ServerResponse} response
				 */
				handler: async (_, response) => {
					const allTODOs = await getAllTODOs()
					response.writeHead(200, {
						'Content-Type': 'application/json'
					})
					response.end(JSON.stringify(allTODOs))
				}
			}
			server.addRoute(getAllTODOsRoute)
		}
	}
}

/**
 * @returns {GetAllTODOsRoute & {
 *   simulateRequest: function(): Promise<void>,
 *   trackerResponses: function(): Array<{status: number, payload: Array<import("../../domain/TODO.js").TODO>}>
 * }}
 */
export function createNull () {
	const serverNullable = HttpServer.createNull()
	const getAllTODOsRoute = GetAllTODOsRoute(serverNullable)
	return {
		addGetAllTODOs: getAllTODOsRoute.addGetAllTODOs,
		/**
		 *
		 */
		async simulateRequest () {
			await serverNullable.simulateRequest({
				method: 'GET',
				path: '/todos'
			})
		},
		/**
		 * @returns {Array<{status: number, payload: Array<import("../../domain/TODO.js").TODO>}>}
		 */
		trackerResponses () {
			return serverNullable.trackerResponses()
		}
	}
}
