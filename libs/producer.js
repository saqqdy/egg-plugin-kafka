const { HighLevelProducer } = require('kafka-node')
const kafkaClient = require('./client')

const defaultOptions = {
	requireAcks: 1,
	ackTimeoutMs: 5000,
	partitionerType: 2
}

module.exports = app => {
	const { logger } = app
	const client = kafkaClient(app)
	const config = app.config.kafka?.producer || {}

	const { topics, autoCreateTopic, ...rest } = config

	const producer = new HighLevelProducer(client, Object.assign({}, defaultOptions, rest))
	producer.on('error', err => {
		logger.error('[egg-plugin-kafka] Kafka producer error:', err)
	})
	producer.on('ready', () => {
		if (autoCreateTopic && topics) {
			producer.createTopics([].concat(topics), false, err => {
				if (err) {
					logger.error(
						`[egg-plugin-kafka] Failed to create topic "${topics.join('&')}":`,
						err
					)
					return
				}
				logger.info(`[egg-plugin-kafka] Topic "${topics.join('&')}" created successfully.`)
			})
		}
	})

	return producer
}
