import { readFile } from 'fs/promises'

/**
 * @param {import("../Log.js").Log} log
 * @param {string} dbPath
 * @returns {function(string): Promise<{id: string, text: string, done: boolean} | undefined>}
 */
export function GetTODO (log, dbPath) {

	log.info('Get TODO from db:', dbPath) // TODO: inject an abstraction that wrapper this (repository)

	return async (id) => {
		const todos = JSON.parse(await readFile(dbPath, 'utf8'))
		return todos.find(todo => todo.id === id)
	}
}
