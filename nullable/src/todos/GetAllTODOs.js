/**
 * @typedef {object} TODO
 * @property {string} id
 * @property {string} text
 * @property {boolean} done
 */

/**
 * @param {{addGetAllTODOs: function(function(): Promise<Array<TODO>>): void}} view
 * @param {import('./infra/TODOsFileRepository').TODOsFileRepository} repository
 */
export function GetAllTODOs (view, repository) {

	view.addGetAllTODOs(getAllTODOs)

	/**
	 * @returns {Promise<Array<TODO>>}
	 */
	async function getAllTODOs () {
		return await repository.getAllTODOs()
	}
}
