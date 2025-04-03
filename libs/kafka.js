// const { sendMessage, sendMessageSync } = require('./sendMessage')
const kafkaProducer = require('./producer')
const kafkaConsumer = require('./consumer')

module.exports = app => {
	const { logger } = app
	const producer = kafkaProducer(app)
	const consumers = kafkaConsumer(app)

	// 在应用关闭时清理 Kafka 连接
	app.beforeClose(async () => {
		producer.close(() => {
			logger.info('Kafka producer closed.')
		})
		consumers.forEach(consumer => {
			consumer.close(() => {
				logger.info(`Kafka consumer "${consumer.id || consumer.options.groupId}" closed.`)
			})
		})
	})

	// 挂载到 app 上
	app.kafka = {
		producer,
		consumers
		// sendMessage: (data = {}) => sendMessage(data, producer, config),
		// sendMessageSync: (data = {}, onsuccess, onerror) =>
		// 	sendMessageSync(data, producer, config, onsuccess, onerror)
	}
	logger.info('Kafka consumer started.')
}
