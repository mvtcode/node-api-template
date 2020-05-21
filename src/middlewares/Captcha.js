'use strict';

import axios from 'axios';
import querystring from 'querystring';
import { colorConsole } from 'tracer';

import config from '../../config';

const logger = colorConsole();

export default () => {
	return async (req, res, next) => {
		if(config.recaptcha.use) {
			const captcha = req.body.captcha;
			if(captcha && typeof captcha === 'string') {
				try {
					const results = await axios.post('https://www.google.com/recaptcha/api/siteverify', querystring.stringify({
						secret: config.recaptcha.secret,
						response: captcha,
						// remoteip
					}), {
						headers: {'Content-type': 'application/x-www-form-urlencoded'}
					});

					const result = results.data;

					/*{
							"success": true,
							"challenge_ts": "2018-12-13T04:20:25Z",
							"hostname": "localhost",
							"score": 0.9
					}*/

					if(result.success) {
						next();
					} else {
						res.sendError({
							error: 2,
							message: 'Captcha không đúng'
						});
					}
				} catch (e) {
					logger.error(e);
					res.sendError({
						error: 1,
						message: 'Xác nhận Captcha bị lỗi'
					});
				}
			} else {
				res.sendError({
					error: 1,
					message: 'Captcha là bắt buộc'
				});
			}
		} else {
			next();
		}
	};
};
