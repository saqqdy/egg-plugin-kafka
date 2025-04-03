const kafka = require('./libs/kafka')

module.exports = agent => {
	if (agent.config.kafka) kafka(agent)
}
