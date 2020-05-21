'use strict';

/**
 * File: index
 * Created by: tanmv
 * Date: 09/03/2020
 * Time: 17:18
 *
 */

export default (action, message) => {
	redis.publish(action, typeof message === 'string' ? message : JSON.stringify(message));
};
