'use strict';

import { colorConsole } from 'tracer';
import { dencrypt } from '../libs/Encript';

const logger = colorConsole();

export default (required) => {
	return async (req, res, next) => {
		const body = req.body;
		if(body.enc && body.data) {
			try {
				req.body = JSON.parse(dencrypt(body.data));
				next();
			} catch (e) {
				logger.error(e);
				res.sendError({
					error: 1001,
					message: 'Dữ liệu mã hóa không đúng'
				});
			}
		} else {
			if(required) {
				res.sendError({
					error: 1002,
					message: 'Dữ liệu phải được mã hóa'
				});
			} else {
				next();
			}
		}
	};
};