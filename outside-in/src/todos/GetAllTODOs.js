import { readFile } from 'fs/promises'

/**
 * @param {import("../Log.js").Log} log
 * @param {string} dbPath
 * @returns {function(): Promise<{id: string, text: string, done: boolean}[]>}
 */
export function GetAllTODOs (log, dbPath) {

	log.info('Get all TODOs from db:', dbPath) // TODO: inject an abstraction that wrapper this (repository)

	return async () => {
		return JSON.parse(await readFile(dbPath, 'utf8'))
	}
}
