'use strict';

/**
 * File: Schema
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 09:59
 * Template by tanmv
 */
import mongoose from 'mongoose';
import Schema from '../schemas/GroupChats';

export const list = async (filters, fields = [], limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const getListIdPrivate = async (listId, fields = []) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(' ') : fields;
	const listObjectId = listId.reduce((arr, _id) => {
		arr.push(mongoose.mongo.ObjectId(_id));
		return arr;
	}, []);

	const query = Schema.find({_id: {$in: listObjectId}, type: 'PRIVATE'});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const listByUser = async (user_id) => {
	const query = Schema.find()
		.populate({
			path: 'group_chat_members',
			match: {
				user_id: mongoose.mongo.ObjectId(user_id),
				select: 'name'
			}
		});

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

export const countList = async (where = {}) => {
	return await Schema.count(where);
};

export const insert = async (info) => {
	if(!info._id) info._id = mongoose.Types.ObjectId();
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
