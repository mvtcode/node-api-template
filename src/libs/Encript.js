'use strict';

import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const password = 'fwAfgf463U*(45PRT"E3d453"?:fgdgs';

export const sha256 = (s) => {
	const enc = crypto.createHash('sha256');
	enc.update(s, 'utf8');
	return enc.digest('hex');
};

export const md5 = (s) => {
	const enc = crypto.createHash('md5');
	enc.update(s, 'utf8');
	return enc.digest('hex');
};

export const encrypt = (text) => {
	const cipher = crypto.createCipher(algorithm, password);
	let crypted = cipher.update(text, 'utf8', 'hex');
	crypted += cipher.final('hex');
	return crypted;
};

export const dencrypt = (text) => {
	const decipher = crypto.createDecipher(algorithm, password);
	let decrypted = decipher.update(text, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
};
