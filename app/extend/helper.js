const { createHash, createSign, randomUUID } = require('node:crypto')
const { ObjectId } = require('mongodb')
const {
	getRandomStr,
	extend,
	fillIPv6,
	getProperty,
	getRandomNum,
	fixNumber,
	arrayToCSV,
	CSVToArray,
	CSVToJSON,
	compareVersion,
	getType,
	isPlainObject,
	JSONToCSV,
	pattern,
	RGBToHex,
	setProperty,
	toThousands
} = require('js-cool')
const qqwry = require('lib-qqwry')()

module.exports = {
	// convertTypes
	convertTypes: {
		toObject:
			({ defaultValue } = {}) =>
			value => {
				if (!value || ['undefined', 'null', 'NaN'].includes(value))
					return defaultValue || {}
				return JSON.parse(value)
			},
		toNumber:
			({ defaultValue } = {}) =>
			value => {
				if (!value || ['undefined', 'null'].includes(value)) return defaultValue || null
				return +value
			}
	},
	async getIP(ip) {
		try {
			return await qqwry.searchIP(ip)
		} catch (e) {
			return {}
		}
	},

	// MD5
	md5(data = '') {
		if (typeof data === 'object') data = JSON.stringify(data)
		return createHash('md5').update(data).digest('hex')
	},

	// base64
	base64: (function (options = {}) {
		/**
		 * Base64加解密
		 */
		function Base64() {
			this.options = Object.assign({}, options)
		}
		Base64.prototype.decode = data => Buffer.from(data, 'base64').toString('utf8')
		Base64.prototype.encode = data => Buffer.from(data).toString('base64')
		return new Base64()
	})(),

	// Generate ObjectId
	getObjectID(id) {
		return id ? ObjectId(id) : ObjectId().toString()
	},

	// base64
	alipay: (function (options = {}) {
		/**
		 * alipay
		 */
		function Alipay() {
			this.options = Object.assign({}, options)
		}
		Alipay.prototype.serializedParams = data => {
			if (data instanceof Object) {
				const keyList = Object.keys(data).sort()
				const initialParams = []
				const encryptedParams = []
				for (const key of keyList) {
					initialParams.push(`${key}=${data[key]}`)
					encryptedParams.push(`${key}=${encodeURIComponent(data[key])}`)
				}
				const initial = initialParams.join('&')
				const encrypted = encryptedParams.join('&')
				return {
					initial,
					encrypted
				}
			}
			throw new Error('must be json string')
		}
		Alipay.prototype.signature = (initial, privateKey) => {
			if (!initial || !privateKey) throw new Error('initial & privateKey is required')
			const sign = createSign('RSA-SHA256')
			sign.update(initial)
			return sign.sign(
				privateKey.includes('BEGIN RSA PRIVATE KEY')
					? privateKey
					: `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`,
				'base64'
			)
		}
		return new Alipay()
	})(),

	/**
	 * 解析模板
	 *
	 * @param {string} tmp 模板名称
	 * @param {object} data 模板数据
	 * @return {string} result
	 */
	mapTemplate(tmp, data) {
		if (!tmp || !data) throw new Error('tmp & data is required')

		return (
			'' +
			tmp.replace(/\{\{([a-zA-Z0-9-_]+)\}\}/g, (a, b) => {
				if (typeof data === 'function') {
					return data(b)
				}
				for (const k in data) {
					if (b === k) {
						return data[k]
					}
				}
			})
		)
	},

	uuid: randomUUID,
	// ===================
	// js-cool
	// ===================
	extend,
	fillIPv6,
	arrayToCSV,
	CSVToArray,
	CSVToJSON,
	JSONToCSV,
	RGBToHex,
	fixNumber,
	getProperty,
	setProperty,
	compareVersion,
	getRandomNum,
	getRandomStr,
	getType,
	isPlainObject,
	pattern,
	toThousands
}
