import { IncomingMessage, ServerResponse } from 'http'

/**
 * @typedef {object} GetAllTODOsRoute
 * @property {function(function(): Promise<Array<import("../../GetAllTODOs.js").TODO>>): void} addGetAllTODOs
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
		 * @param {function(): Promise<Array<import("../../GetAllTODOs.js").TODO>>} getAllTODOs
		 */
		addGetAllTODOs (getAllTODOs) {
			server.addRoute({
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
		}
	}
}

/**
 * @returns {GetAllTODOsRoute & {
 *   simulateRequest: function(): Promise<void>,
 *   trackerResponses: function(): Array<{status: number, payload: Array<import("../../GetAllTODOs.js").TODO>}>
 * }}
 */
export function createNull () {
	const trackerResponses = TrackerResponses()
	let serverRoute
	const getAllTODOs = GetAllTODOsRoute({
		/**
		 * @param {import('../../../web/Server.js').Route} route
		 */
		addRoute (route) {
			serverRoute = route
		}
	})
	let responseStatus
	return {
		addGetAllTODOs: getAllTODOs.addGetAllTODOs,
		/**
		 *
		 */
		async simulateRequest () {
			await serverRoute.handler({}, {
				/**
				 * @param {number} status
				 */
				writeHead: (status) => {
					responseStatus = status
				},
				/**
				 * @param {import("../../GetAllTODOs.js").TODO} payload
				 */
				end: (payload) => {
					trackerResponses.trackResponse(responseStatus, payload)
				}
			})
		},
		/**
		 * @returns {Array<{status: number, payload: Array<import("../../GetAllTODOs.js").TODO>}>}
		 */
		trackerResponses () {
			return trackerResponses.getResponses()
		}
	}
}

/**
 * @returns {{
 *   getResponses: function(): Array<{status: number, payload: Array<import("../../GetAllTODOs.js").TODO>}>,
 *   trackResponse: function(number, any): void
 * }}
 */
function TrackerResponses () {

   const responses = []

   return {
		/**
		 * @returns {Array<{status: number, payload: Array<import("../../GetAllTODOs.js").TODO>}>}
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
