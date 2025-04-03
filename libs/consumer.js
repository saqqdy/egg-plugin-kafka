const { ConsumerGroup } = require('kafka-node')

const defaultOptions = {
	// kafkaHost: 'broker:9092', // connect directly to kafka broker (instantiates a KafkaClient)
	// batch: undefined, // put client batch settings if you need them
	// ssl: true, // optional (defaults to false) or tls options hash
	// groupId: 'ExampleTestGroup',
	sessionTimeout: 15000,
	// An array of partition assignment protocols ordered by preference.
	// 'roundrobin' or 'range' string for built ins (see below to pass in custom assignment protocol)
	protocol: ['roundrobin'],
	encoding: 'utf8', // default is utf8, use 'buffer' for binary data
	autoCommit: false,
	// autoCommitIntervalMs: 500,
	// Offsets to use for new groups other options could be 'earliest' or 'none' (none will emit an error if no offsets were saved)
	// equivalent to Java client's auto.offset.reset
	fromOffset: 'latest', // default
	commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
	// how to recover from OutOfRangeOffset error (where save offset is past server retention) accepts same value as fromOffset
	outOfRangeOffset: 'earliest', // default
	// The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
	fetchMaxWaitMs: 100,
	// This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
	fetchMinBytes: 1,
	// The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
	fetchMaxBytes: 1024 * 1024,
	migrateHLC: false, // for details please see Migration section below
	migrateRolling: true
	// Callback to allow consumers with autoCommit false a chance to commit before a rebalance finishes
	// isAlreadyMember will be false on the first connection, and true on rebalances triggered after that
	// onRebalance: (isAlreadyMember, callback) => { callback(); } // or null
}

module.exports = app => {
	const { logger } = app
	const config = app.config.kafka || {}
	const kafkaHost = config.client.kafkaHost || config.kafkaHost

	return (config.consumer || []).map(({ option, groupId, topics }) => {
		const consumer = new ConsumerGroup(
			Object.assign({}, defaultOptions, { groupId, kafkaHost }, option),
			[].concat(topics)
		)
		consumer.on('message', message => {
			logger.info(
				`[egg-plugin-kafka] [topic=${message.topic}] Received message from Kafka:`,
				message
			)
			try {
				const parsedMessage = JSON.parse(message.value)
				logger.info(
					`[egg-plugin-kafka] [topic=${message.topic}] Processing message:`,
					parsedMessage
				)
				// 调用其他服务处理消息
				// app.service.someOtherService.processMessage(parsedMessage)
			} catch (error) {
				logger.error(
					`[egg-plugin-kafka] [topic=${message.topic}] Error processing Kafka message:`,
					error
				)
			}
		})

		consumer.on('error', err => {
			console.error('Error in consumer:', err)
		})
		consumer.id = groupId

		return consumer
	})
}
