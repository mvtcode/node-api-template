'use strict';

/**
 * File: GroupChatMessages
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 10:29
 * Template by tanmv
 */

import * as Models from '../models/GroupChatMessages';
import consts from '../../config/consts';
import { toJson } from "../libs/Parse";

export const info = async (filters, fields) => {
	return await Models.info(filters, fields);
};

export const list = async (filters, fields, sort, limit, skip) => {
	return await Models.list(filters, fields, sort, limit, skip);
};

export const countList = async (where = {}) => {
	return await Models.countList(where);
};

export const insert = async (info) => {
	const newMessage = await Models.insert(info);

	// update to cache
	if(newMessage && newMessage._id) {
		const key = consts.redis_key.lastGroupMessage(info.group_id);
		await redis.set(key, JSON.stringify(newMessage));
	}
	// end update to cache

	return newMessage
};

export const update = async (id, info) => {
	return await Models.update(id, info);
};

export const remove = async (id) => {
	return await Models.remove(id);
};

export const removeAllMessage = async (group_id) => {
	const result = await Models.remove(group_id);

	// remove cache
	const key = consts.redis_key.lastGroupMessage(group_id);
	await redis.delete(key);
	// end remove cache

	return result;
};

export const getLastMessageOfGroup = async ( group_id ) => {
	const key = consts.redis_key.lastGroupMessage(group_id);
	const dataCache = toJson(await redis.get(key));

	if (dataCache) return dataCache;
	else {
		const list = await Models.list({ group_id }, null, { created_at: -1 }, 1, 0);

		if (list && list.length > 0) {
			const lastMsg = list[0];

			redis.set(key, JSON.stringify(lastMsg));

			return lastMsg;
		}

		return null;
	}
};
