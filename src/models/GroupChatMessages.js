'use strict';

/**
 * File: Schema
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 10:06
 * Template by tanmv
 */
import mongoose from 'mongoose';
import Schema from '../schemas/GroupChatMessages';

export const list = async (filters, fields = [], sort = {}, limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(' ') : fields;

	// refactor field type objectId
	if(filters && filters.group_id) filters.group_id = mongoose.mongo.ObjectId(filters.group_id);
	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (sort && Object.keys(sort).length > 0) query.sort(sort);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const info = async (id, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.findOne({
		_id: mongoose.mongo.ObjectId(id)
	});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const countList = async (filters = {}) => {
	// refactor field type objectId
	if(filters && filters.group_id) filters.group_id = mongoose.mongo.ObjectId(filters.group_id);
	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);

	return await Schema.count(filters);
};

export const insert = async (info) => {
	if(!info._id) info._id = mongoose.Types.ObjectId();
	if(info.group_id) info.group_id = mongoose.Types.ObjectId(info.group_id);
	if(info.user_id) info.user_id = mongoose.Types.ObjectId(info.user_id);
	const newInfo = new Schema(info);
	return await newInfo.save();
};

export const update = async (id, info) => {
	return await Schema.update({
		_id: mongoose.mongo.ObjectId(id)
	}, {
		$set: info
	}, {
		multi: false,
		upsert: false
	});
};

export const remove = async (id) => {
	return await Schema.remove({
		_id: mongoose.mongo.ObjectId(id)
	});
};

export const removeAllMessage = async (group_id) => {
	return await Schema.remove({
		group_id: mongoose.mongo.ObjectId(group_id)
	});
};
