const kafka = require('./libs/kafka')

module.exports = app => {
	if (app.config.kafka) kafka(app)
}
