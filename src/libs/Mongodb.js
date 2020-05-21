/**
 * Created by tanmv on 27/05/2018.
 */

'use strict';
import mongoose from 'mongoose';
import colors from 'colors';

export default (conf) => {
	return new Promise((resolve, reject) => {
		mongoose.connect(conf.connect, conf.option);
		mongoose.set('debug', conf.debug);
		mongoose.connection.on('connected', () => {
			console.log(colors.cyan('MongoDB: ') + colors.green('connected'));
			resolve(mongoose);
		});

		mongoose.connection.on('error', (err) => {
			console.log(colors.cyan('MongoDB: ') + colors.red('error'));
			reject(err);
		});
	});
}

process.on('SIGINT', () => {
	if(mongoose.connection) {
		mongoose.connection.close();
	}
});