const util = require('node:util')
const { Transport } = require('egg-logger')

class LogsTransport extends Transport {
	async log(level, args, meta) {
		super.log(level, args, meta)
		const { config, name, kafka } = this.options.app
		if (meta) {
			const { ctx } = meta
			const clientIp = (
				ctx.request.get('X-Real-IP') ||
				ctx.request.get('X-Forwarded-For') ||
				ctx.request.ip.replace(/::ffff:/, '') ||
				ctx.req.headers.remote_addr ||
				ctx.req.headers.client_ip ||
				ctx.req.connection.remoteAddress ||
				ctx.req.socket.remoteAddress ||
				ctx.req.connection.socket.remoteAddress ||
				ctx.ip
			)
				.match(/[.\d\w]+/g)
				.join('')

			let message
			if (args[0] instanceof Error) {
				const err = args[0]
				message = util.format(
					'%s: %s\n%s\npid: %s\n',
					err.name,
					err.message,
					err.stack,
					process.pid
				)
			} else {
				message = util.format(...args)
			}
			kafka.producer.send(
				[
					{
						topic: config.logger.topic,
						messages: JSON.stringify({
							logType: config.logType || name,
							level,
							message,
							url: ctx.originalUrl,
							clientIp,
							routerName: ctx.routerName,
							routerPath: ctx.routerPath,
							starttime: ctx.starttime || Date.now(),
							// captures: ctx.captures,
							// query: JSON.stringify(ctx.query),
							// params: JSON.stringify(ctx.params),
							pathName: this.pathName, // className
							fullPath: this.fullPath,
							locale: ctx.locale,
							execTime: Date.now() - ctx.starttime, // 执行时间
							// accessToken: '',
							// projectId: '',
							// serverName: config.logger.serverName,
							// serviceHostName: meta.hostname,
							// traceId: '',
							// user: '',
							// userId: '',
							// pid: meta.pid,
							version: ctx.version
						})
					}
				],
				(err, data) => {
					if (err) console.error('Failed to send message to Kafka:', err)
				}
			)
		}
	}
}

module.exports = LogsTransport
