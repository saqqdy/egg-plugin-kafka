/**
 * egg-plugin-kafka default config
 *
 * @member Config#kafka
 * @property {String} SOME_KEY - some description
 */
exports.kafka = {
	client: {
		kafkaHost: 'localhost:9092',
		sasl: {
			mechanism: 'plain',
			username: 'admin',
			password: 'admin'
		}
	},
	consumer: [
		{
			groupId: 'test-group',
			topics: ['test-topic'],
			option: {
				fetchMaxWaitMs: 100,
				fetchMinBytes: 1,
				fetchMaxBytes: 1024 * 1024
			}
		}
	],
	producer: {
		topics: ['test-topic'],
		autoCreateTopic: true
	}
}
