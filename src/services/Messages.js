"use strict";

/**
 * File: Messages
 * Created by: tanmv
 * Date: 27/03/2020
 * Time: 20:45
 * Template by tanmv
 */

import * as Models from "../models/Messages";
import consts from "../../config/consts";
import { toJson } from "../libs/Parse";

export const list = async (filters, fields, sort, limit, skip) => {
	return await Models.list(filters, fields, sort, limit, skip);
};

export const listByUser = async (user_id1, user_id2, fields, sort, limit, skip) => {
	return await Models.listByUser(user_id1, user_id2, fields, sort, limit, skip);
};

export const info = async (_id, fields) => {
	return await Models.info(_id, fields);
};

export const count = async (where) => {
	return await Models.count(where);
};

export const countByUser = async (user_id1, user_id2) => {
	return await Models.countByUser(user_id1, user_id2);
};

export const insert = async (info) => {
	const newMessage = await Models.insert(info);

	// update to cache
	if(newMessage && newMessage._id) {
		const key = consts.redis_key.lastMessage(info.group_id);
		await redis.set(key, JSON.stringify(newMessage));
	}
	// end update to cache

	return newMessage
};

export const update = async (_id, info) => {
	return await Models.update(_id, info);
};

export const remove = async (_id) => {
	return await Models.remove(_id);
};

export const getLastMessage = async ( user_id1, user_id2 ) => {
	const key = consts.redis_key.lastMessage( user_id1, user_id2 );
	const dataCache = toJson(await redis.get(key));

	if (dataCache) return dataCache;
	else {
		const list = await Models.listByUser(user_id1, user_id2, null, { created_at: -1 }, 1, 0);

		if (list && list.length > 0) {
			const lastMsg = list[0];

			redis.set(key, JSON.stringify(lastMsg));

			return lastMsg;
		}

		return null;
	}
};

export const listPrivate = async (user_id) => {
	return await Models.listPrivate(user_id);
};
