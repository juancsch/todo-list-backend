/**
 * @param {{onGetTODO: function(function(string): Promise<import('../domain/TODO.js').TODO | undefined>): void}} view
 * @param {import('../infra/TODOsFileRepository.js').TODOsFileRepository} repository
 */
export function GetTODO (view, repository) {

	view.onGetTODO(getTODO)

	/**
	 * @param {string} id
	 * @returns {Promise<import('../domain/TODO.js').TODO | undefined>}
	 */
	async function getTODO (id) {
		return await repository.getTODO(id)
	}
}
