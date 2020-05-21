'use strict';

/**
 * File: GroupChats
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 10:18
 * Template by tanmv
 */

import * as Models from '../models/GroupChats';

export const info = async (id, fields) => {
	return await Models.info(id, fields);
};

export const list = async (filters, fields = [], limit = 0, skip = 0) => {
	return await Models.list(filters, fields, limit, skip);
};

export const findOnePrivateById = async (user_id1, user_id2) => {
	return await Models.getListIdPrivate(user_id1, user_id2);
};

export const listByUser = async (user_id) => {
	return await Models.listByUser(user_id);
};

export const countList = async (where = {}) => {
	return await Models.countList(where);
};

export const insert = async (info) => {
	return await Models.insert(info);
};

export const update = async (id, info) => {
	return await Models.update(id, info);
};

export const remove = async (id) => {
	return await Models.remove(id);
};
