'use strict';

/**
 * File: GroupChatMessageReads
 * Created by: tanmv
 * Date: 22/03/2020
 * Time: 21:30
 * Template by tanmv
 */
import Schema from '../schemas/GroupChatMessageReads';
import mongoose from "mongoose";

export const list = async (filters, fields = [], sort = {}, limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (sort && Object.keys(sort).length > 0) query.sort(sort);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const info = async (_id, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.findOne({_id});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const insert = async (info) => {
	const newInfo = new Schema(info);
	return await newInfo.save();
};

export const update = async (_id, info) => {
	return await Schema.update({_id}, {$set: info}, {multi: false, upsert: false});
};

export const remove = async (_id) => {
	return await Schema.remove({_id});
};

export const findOne = async (filters, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	// refactor field type objectId
	if(filters.group_id) filters.group_id = mongoose.Types.ObjectId(filters.group_id);
	if(filters.user_id) filters.user_id = mongoose.Types.ObjectId(filters.user_id);

	const query = Schema.findOne(filters);
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const infoByUser = async (user_id, group_id, fields = ['message_id']) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.findOne({
		group_id: mongoose.Types.ObjectId(group_id),
		user_id: mongoose.Types.ObjectId(user_id)
	});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const updateRead = async (group_id, user_id, message_id) => {
	return await Schema.findOneAndUpdate({
		group_id: mongoose.Types.ObjectId(group_id),
		user_id: mongoose.Types.ObjectId(user_id)
	}, {
		$set: {
			message_id: mongoose.Types.ObjectId(message_id)
		},
		// $setOnInsert: {
		// 	created_at: new Date()
		// }
	}, {
		// new: true,
		upsert: true,
		setDefaultsOnInsert: true
	});
};

export const countList = async (filters = {}) => {
	// refactor field type objectId
	if(filters && filters.group_id) filters.group_id = mongoose.mongo.ObjectId(filters.group_id);
	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);
	if(filters && filters.message_id) filters.message_id = mongoose.mongo.ObjectId(filters.message_id);

	return await Schema.count(filters);
};
