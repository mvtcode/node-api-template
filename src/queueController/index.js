'use strict';

/**
 * File: RabbitMq
 * Created by: tanmv
 * Date: 30/11/2018
 * Time: 22:04
 *
 */

import amqp from 'amqp';
import { colorConsole } from 'tracer';
import colors from 'colors';

import config from '../../config';

const logger = colorConsole();
const connection = amqp.createConnection(config.rabbitMq);

connection.on('error', function(e) {
	logger.error('Error from amqp: ', e);
});

connection.on('ready', function () {
	console.log(colors.cyan('RabbitMq: ') + colors.green('connected'));
});

export const publish = (channel, message) => {
	connection.publish(channel, message, {contentType: 'application/json'});
};
