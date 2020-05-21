'use strict';

/**
 * File: GroupChatMembers
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 10:26
 * Template by tanmv
 */

import * as Models from '../models/GroupChatMembers';
import consts from '../../config/consts';

export const info = async (id, fields) => {
	return await Models.info(id, fields);
};

export const findOne = async (filters, fields) => {
	return await Models.findOne(filters, fields);
};

export const list = async (filters, fields = [], limit = 0, skip = 0) => {
	return await Models.list(filters, fields, limit, skip);
};

export const listMembersInGroup = async (group_id) => {
	const list = await Models.listMembersInGroup(group_id);

	if (list && list.length > 0) {
		list.forEach(_info => {
			_info._id = _info._id[0];
			_info.name = _info.name[0] || "";
			_info.avatar = _info.avatar[0] || "";
		});
	}
	return list;
};

export const listGroup = async (filters) => {
	const list = await Models.listGroup(filters);
	if (list && list.length > 0) {
		list.forEach(_info => {
			_info.name = _info.name[0];
			_info.type = _info.type[0];
		});
	}
	return list;
};

export const getGroupIdPrivate = async ( user_id_1, user_id_2 ) => {
	const list1 = await Models.list({ user_id: user_id_1, role: 'USER' }, ['group_id']);
	if ( list1 && list1.length > 0 ) {
		const list2 = await Models.list({ user_id: user_id_2, role: 'USER' }, ['group_id']);
		if ( list2 && list2.length > 0 ) {
			const listId1 = list1.reduce((arr, _info) => {
				arr.push(_info.group_id.toString());
				return arr;
			}, []);

			return list2.reduce((arr, _info) => {
				const group_id = _info.group_id.toString();
				if (listId1.includes(group_id)) {
					arr.push(group_id);
				}
				return arr;
			}, []);
		}
	}

	return null;
};

export const countList = async (where = {}) => {
	return await Models.countList(where);
};

export const insert = async (info) => {
	const newInfo = await Models.insert(info);

	const key = consts.redis_key.listGroupMember(newInfo.group_id);
	redis.del(key);

	return newInfo;
};

export const update = async (id, info) => {
	return await Models.update(id, info);
};

export const remove = async (id) => {
	return await Models.remove(id);
};

export const removeByUser = async (group_id, user_id) => {
	const result = await Models.removeByUser(group_id, user_id);

	// remove cache
	const key = consts.redis_key.listGroupMember(group_id);
	redis.del(key);
	// end remove cache

	return result;
};

export const removeAllUser = async (group_id) => {
	const result = await Models.removeAllUser(group_id);

	// remove cache
	const key = consts.redis_key.listGroupMember(group_id);
	redis.del(key);
	// end remove cache

	return result;
};
