'use strict';

module.exports = {
	port: 8080,
	hostname: '127.0.0.1',

	recaptcha: {
		use: true,
		key: '',
		secret: ''
	},

	mongodb: {
		connect: 'mongodb://127.0.0.1:27017/test',
		option: {
			useNewUrlParser: true,
			useCreateIndex: false,
			autoReconnect: true,
			autoIndex: false,
			reconnectInterval: 500,
			// user: null,
			// pass: null
		},
		debug: false
	},

	redis: {
		monitor: false,
		connect: {
			port: 6379,
			host: '127.0.0.1',
			db: 0,
			// password: null
			family: 4 // 4 (IPv4) or 6 (IPv6)
		}
	},

	rabbitMq: {
		host: '127.0.0.1',
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
			domain: '.mvt.com',
			maxAge: 86400000, // 1d
			httpOnly: true,
			path: '/'
		}
	}
};
