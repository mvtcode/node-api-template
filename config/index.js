'use strict';

const production = require('./production');
const development = require('./development');

const config = {
	port: 8088,
	hostname: '127.0.0.1',

	recaptcha: {
		use: false,
		key: '',
		secret: ''
	},

	mongodb: {
		// connect: 'mongodb://127.0.0.1:27017/test',
		option: {
			// useMongoClient: true,
			// poolSize: 10,
			autoReconnect: true,
			// user: null,
			// pass: null,
			//replset: { rs_name: 'HorusRS', auto_reconnect: true, poolSize: 100, connectWithNoPrimary: true,},
			config: { autoIndex: false}
		},
		// debug: true
	},

	redis: {
		monitor: false,
		connect: {
			port: 6379,
			host: '127.0.0.1',
			db: 0,
			// password: null
			family: 4 // 4 (IPv4) or 6 (IPv6)
		},
		retryStrategy: times => {
			return Math.min(times * 50, 2000);
		}
	},

	rabbitMq: {
		// host: 'localhost',
		port: 5672,
		// login: 'admin',
		// password: 'admin@123',
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
			// domain: '',
			maxAge: 86400000,
			httpOnly: true,
			path: '/'
		}
	}
};

const configFinal = process.env.NODE_ENV === 'production' ? Object.assign(config, production): Object.assign(config, development);
module.exports = configFinal;
// export default configFinal;
