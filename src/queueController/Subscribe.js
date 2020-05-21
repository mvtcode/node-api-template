'use strict';

import { toJson } from '../libs/Parse';
import * as Service from '../services/Users';

export default (connection) => {
	connection.queue('history-exam', {
		autoDelete: false
	}, queue => {
		queue.subscribe({ack: true, prefetchCount: 1}, async (message) => {
			if(typeof message === 'string') {
				message = toJson(message);
			}

			switch (message.action) {
				case 'addQuestion':
					try {
						await Service.addQuestion(message.info);
						queue.shift(false);
					} catch(e) {
						queue.shift(true);
						console.error(e);
					}
					break;
				case 'pushAnswers':
					try {
						message.answer.date = new Date();
						await Service.pushAnswers(message.user_id, message.round_id, message.test_id, message.answer);
						queue.shift(false);
					} catch(e) {
						queue.shift(true);
						console.error(e);
					}
					break;
				case 'Update':
					try {
						await Service.Update(message.user_id, message.round_id, message.test_id, message.info);
						queue.shift(false);
					} catch(e) {
						queue.shift(true);
						console.error(e);
					}
					break;
				default:
					queue.shift(false);
					break;
			}
		});
	});
};
