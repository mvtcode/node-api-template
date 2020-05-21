'use strict';

/**
 * File: IoRedis
 * Created by: tanmv
 * Date: 05/03/2020
 * Time: 17:42
 *
 */

import Redis from 'ioredis';
import colors from "colors";

export default (conf) => {
	return new Promise((resolve, reject) => {
		let bFirst = true;

		const redis = new Redis(conf.connect);

		if(conf.monitor) {
			redis.monitor((err, monitor) => {
				monitor.on('monitor', (time, args, source, database) => {
					console.log(colors.cyan('Redis:'), colors.blue( database ), colors.yellow( source ), colors.green(args.join(' ')));
				});
			});
		}

		redis.on('connect', () => {
			console.log(colors.cyan('Redis:'), colors.green('connected'));
			if(bFirst){
				resolve(redis);
				bFirst = false;
			}
		});

		redis.on('error', (error) => {
			console.log(colors.cyan('Redis:'), colors.red('connected', error));

			reject(error);
		});

		redis.on('close',() => {
			console.log(colors.cyan('Redis:'), colors.red('close'));
		});

		redis.on('reconnecting', () => {
			console.log(colors.cyan('Redis:'), colors.yellow('reconnecting'));
		});

		process.on('SIGINT', () => {
			try{
				redis.disconnect();
			} catch (e) {
				console.error(e);
			}
		});
	});
}
