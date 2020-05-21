/**
 * Created by tanmv on 2018-04-17.
 */
'use strict';

import moment from 'moment';

/**
 * @param s: Object
 * @param defaults json
 * @returns json
 */
export const toJson = (s, defaults) => {
	try {
		if (typeof s === 'string') {
			return JSON.parse(s)
		}
		return null
	} catch (e) {
		if (defaults) return defaults;
		else return null;
	}
};

/**
 * @param s: Object
 * @param defaults int
 * @returns int
 */
export const toInt = (s, defaults) => {
	if(typeof s === 'number') return parseInt(s);
	if(typeof s === 'string') {
		const pattern = /^(\-)?\d+(\.\d+)?$/;
		if(pattern.test(s)) return parseInt(s);
	}
	if (defaults) return defaults;
	return 0;
};

/**
 * @param s: Object
 * @param defaults float
 * @returns float
 */
export const toFloat = (s, defaults) => {
	if(typeof s === 'number') return parseFloat(s);
	if(typeof s === 'string') {
		const pattern = /^(\-)?\d+(\.\d+)?$/;
		if(pattern.test(s)) return parseFloat(s);
	}
	if (defaults) return defaults;
	return 0;
};

/**
 * @param obj: Object
 * @param defaults String
 * @returns String
 */
export const toString = (obj, defaults) => {
	try {
		if(obj) {
			let type = typeof obj;
			switch (type) {
				case 'string':
					return obj;
				case 'number':
					return String(obj);
				case 'object':
					return JSON.stringify(obj);
				default:
					return String(obj)
			}
		}
	} catch (e) {
		if (defaults) return defaults
	}
	return ''
};

export const toDate = (obj, format = 'DD/MM/YYYY') => {
	if(moment(obj, format).isValid()) {
		return moment(obj, format).toDate();
	}
	return null;
};