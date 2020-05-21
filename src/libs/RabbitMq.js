'use strict';

/**
 * File: RabbitMq
 * Created by: tanmv
 * Date: 02/08/2018
 * Time: 11:07
 *
 */

import amqp from 'amqp';

export default (conf) => {
	return new Promise((resolve, reject) => {
		const connection = amqp.createConnection(conf);

		connection.on('ready', () => {
			console.log('rabbitmq connected');
			resolve(connection);
		});

		connection.on('error', (e) => {
			console.error('rabbitmq connect error', e);
			reject(e);
		});
	});
}
