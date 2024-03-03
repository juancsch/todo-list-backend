import { readFile } from 'fs/promises'

/**
 * @param {import("../Log.js").Log} log
 * @param {import("../Config.js").Config} config
 * @returns {function(): Promise<{id: string, text: string, done: boolean}[]>}
 */
export function GetAllTODOs (log, config) {

	log.info('Get all TODOs from db:', config.dbPath)

	return async () => {
		return JSON.parse(await readFile(config.dbPath, 'utf8'))
	}
}
