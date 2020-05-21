'use strict';

module.exports = {
	port: 3000,
	hostname: '0.0.0.0',

	recaptcha: {
		use: false,
		key: '',
		secret: ''
	},

	mongodb: {
		connect: 'mongodb://192.168.100.20:27017/test',
		option: {
			useNewUrlParser: true,
			useCreateIndex: false,
			autoReconnect: true,
			autoIndex: false,
			reconnectInterval: 500,
			// user: null,
			// pass: null
		},
		debug: true
	},

	redis: {
		monitor: true,
		connect: {
			port: 6379,
			host: '192.168.100.30',
			db: 0,
			password: '123456',
			family: 4 // 4 (IPv4) or 6 (IPv6)
		}
	},

	rabbitMq: {
		vhost: '/',
		host: '192.168.100.40',
		port: 5672,
		login: 'admin',
		password: 'admin@123',
		connectionTimeout: 10000,
		noDelay: true,
		ssl: {
			enabled : false
		}
	},

	password_prefix: 'mvt-',
	token: {
		cookie_name: 'token',
		option: {
			// domain: 'localhost',
			maxAge: 86400000,
			httpOnly: true,
			path: '/'
		}
	}
};
