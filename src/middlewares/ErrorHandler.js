// Error handler
import config from'../../configs';
import logs from '../log/Logstash';

export const error404 = () => {
	return function (req, res, next) {
		if (config.env == 'development') {
			// console.log(err.stack);
		}
		res.sendError({code: 404});
	};
};

export const errorHandler = () => {
	return function (err, req, res, next) {
		res.sendError({code: 500, message: err});
	}
};