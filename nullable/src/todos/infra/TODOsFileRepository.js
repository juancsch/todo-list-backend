import fs from 'node:fs/promises'

/**
 * @typedef {object} TODOsFileRepository
 * @property {function(): Promise<Array<{id: string, text: string, done: boolean}>>} getAllTODOs
 */

/**
 * @param {string} dbPath
 * @returns {TODOsFileRepository}
 */
export function create (dbPath) {
	return TODOsFileRepository(dbPath)
}

/**
 * @param {Array<{id: string, text: string, done: boolean}>} todos
 * @returns {TODOsFileRepository}
 */
export function	createNull (todos = []) {
	return TODOsFileRepository('dummy', {
		/**
		 * @returns {Promise<any>}
		 */
		readFile: async () => JSON.stringify(todos)
	})
}

/**
 * @param {string} dbPath
 * @param {{
 *   readFile: fs.readFile
 * }} _fs
 * @returns {TODOsFileRepository}
 }}
 */
function TODOsFileRepository (dbPath, _fs = fs) {
	return {
		/**
		 * @returns {Promise<Array<{id: string, text: string, done: boolean}>>}
		 */
		async getAllTODOs () {
			return JSON.parse(await _fs.readFile(dbPath, 'utf8'))
		}
	}
}
