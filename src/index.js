'use strict';

import config from '../config';
import app from './app';
import Mongodb from './libs/Mongodb';
import colors from 'colors';
import IoRedis from "./libs/IoRedis";

// import RabbitMq from './libs/RabbitMq';
// import queueController from './queueController';

( async  () => {
	// config mongodb
	try {
		await Mongodb(config.mongodb);
	} catch(e) {
		console.error(e);
		process.exit(1);
	}

	// connect redis
	try {
		global.redis = await IoRedis(config.redis);
	} catch(e) {
		console.error(e);
		process.exit(1);
	}

	// RabbitMq
	// try {
	// 	const rabbitMqClient = await RabbitMq(config.rabbitMq);
	// 	queueController(rabbitMqClient);
	// } catch (e) {
	// 	console.error(e);
	// 	process.exit(1);
	// }

	// webserver API
	try {
		const server = app.listen(config.port, config.hostname, () => {
			const {address, port} = server.address();
			console.log(colors.cyan('ApiServer: ') + colors.green(`http://${address}:${port}`));
		});
	} catch(e) {
		console.error(e);
		process.exit(1);
	}
})();

process.on('SIGINT', () => {
	setTimeout(() => {
		process.exit(0);
	},1000);
});
