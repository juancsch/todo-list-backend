import fs from 'node:fs/promises'

/**
 * @typedef {object} TODOsFileRepository
 * @property {function(): Promise<Array<{id: string, text: string, done: boolean}>>} getAllTODOs
 * @property {function(string): Promise<{id: string, text: string, done: boolean} | undefined>} getTODO
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
		},
		/**
		 * @param {string} id
		 * @returns {Promise<{id: string, text: string, done: boolean} | undefined>}
		 */
		async getTODO (id) {
			const todos = await this.getAllTODOs()
			return todos.find(todo => todo.id === id)
		}
	}
}
