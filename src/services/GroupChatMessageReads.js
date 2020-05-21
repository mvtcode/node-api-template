'use strict';

/**
 * File: GroupChatMessageReads
 * Created by: tanmv
 * Date: 22/03/2020
 * Time: 21:53
 * Template by tanmv
 */

import * as Models from '../models/GroupChatMessageReads';

export const list = async (filters, fields, sort, limit, skip) => {
	return await Models.list(filters, fields, sort, limit, skip);
};

export const info = async (_id, fields) => {
	return await Models.info(_id, fields);
};

export const infoByUser = async (user_id, group_id, fields) => {
	return await Models.infoByUser(user_id, group_id, fields);
};

export const findOne = async (filters, fields) => {
	return await Models.findOne(filters, fields);
};

export const count = async (where) => {
	return await Models.count(where);
};

export const insert = async (info) => {
	return await Models.insert(info);
};

export const update = async (_id, info) => {
	return await Models.update(_id, info);
};

export const remove = async (_id) => {
	return await Models.remove(_id);
};

export const updateRead = async (group_id, user_id, message_id) => {
	return await Models.updateRead(group_id, user_id, message_id);
};

export const countList = async (filters) => {
	return await Models.countList(filters);
};
