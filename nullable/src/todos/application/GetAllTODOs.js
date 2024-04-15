/**
 * @param {{onGetAllTODOs: function(function(): Promise<Array<import('../domain/TODO.js').TODO>>): void}} view
 * @param {import('../infra/TODOsFileRepository.js').TODOsFileRepository} repository
 */
export function GetAllTODOs (view, repository) {

	view.onGetAllTODOs(getAllTODOs)

	/**
	 * @returns {Promise<Array<import('../domain/TODO.js').TODO>>}
	 */
	async function getAllTODOs () {
		return await repository.getAllTODOs()
	}
}
