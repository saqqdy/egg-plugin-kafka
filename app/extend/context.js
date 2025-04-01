const dayjs = require('dayjs')

module.exports = {
	get version() {
		return dayjs().format('YYYY-MM-DD HH:mm:ss')
	}
}
