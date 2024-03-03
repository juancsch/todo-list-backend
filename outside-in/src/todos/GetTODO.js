import { readFile } from 'fs/promises'

/**
 * @param {import("../Log.js").Log} log
 * @param {import("../Config.js").Config} config
 * @returns {function(string): Promise<{id: string, text: string, done: boolean} | undefined>}
 */
export function GetTODO (log, config) {

	log.info('Get TODO from db:', config.dbPath)

	return async (id) => {
		const todos = JSON.parse(await readFile(config.dbPath, 'utf8'))
		return todos.find(todo => todo.id === id)
	}
}
