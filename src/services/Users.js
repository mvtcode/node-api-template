'use strict';

/**
 * File: Users
 * Created by: tanmv
 * Date: 01/02/2019
 * Time: 11:16
 * Template by tanmv
 */

import * as Models from '../models/Users';

export const info = async (_id, fields) => {
	return await Models.info(_id, fields);
};

export const infoByEmail = async (email) => {
	return await Models.infoByEmail(email);
};

export const infoByUsername = async (username) => {
	return await Models.infoByUsername(username);
};

export const infoByEmailOrMobile = async (email) => {
	return await Models.infoByEmailOrMobile(email);
};

export const list = async (where = {}, fields = ['_id'], page_size = 20, page_index = 0) => {
	return await Models.list(where, fields, page_size, page_index);
};

export const listById = async (ids, fields) => {
	return await Models.listById(ids, fields);
};

export const countList = async (where) => {
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
