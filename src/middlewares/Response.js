/**
 * Created by tanmv on 27/05/2018.
 */

'use strict';

import ErrorMessage from '../libs/ErrorMessage';

export const sendJson = (req, res, next) => {
	res.sendJson = ({list, info, result, paging}) => {
		res.json({
			error: 0,
			message: '',
			list,
			info,
			result,
			paging
		});
	};
	next();
};

export const sendError = (req, res, next) => {
	res.sendError = ({status, error, message}) => {
		res.status(status || 200).json({
			error: error || 1000,
			message: message || ErrorMessage[error] || 'error'
		});
	};
	next();
};