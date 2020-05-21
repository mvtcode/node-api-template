'use strict';

import mongoose from 'mongoose';
import Schema from '../schemas/Users';

export const list = async (filters = {}, fields, page_size = 20, page_index = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) && fields.length > 0 ? fields.join(' ') : fields;

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (page_size) query.limit(page_size);
	if (page_index) query.skip(page_index * page_size);

	return await query.exec();
};

export const countList = async (where = {}) => {
	return await Schema.count(where);
};

export const info = async (_id, fields) => {
	const fieldsSelect = fields && Array.isArray(fields) && fields.length > 0 ? fields.join(' ') : fields;
	const query = Schema.findOne({_id: mongoose.mongo.ObjectId(_id)});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

// use for login
export const infoByEmail = async (email) => {
	return await Schema.findOne({email});
};

// use for login
export const infoByUsername = async (username) => {
	return await Schema.findOne({username});
};

export const infoByEmailOrMobile = async (email) => {
	return await Schema.findOne({
		$or: [{email}, {mobile: email}]
	});
};

// use for login
export const checkExists = async (email) => {
	return await Schema.countDocuments({email}) > 0;
};

export const insert = async (info) => {
	if(!info._id) info._id = mongoose.Types.ObjectId();
	const schema = new Schema(info);
	return await schema.save();
};

export const update = async (_id, info) => {
	info.updated_at = new Date();
	
	return await Schema.updateOne({
		_id: mongoose.Types.ObjectId(_id)
	}, {
		$set: info
	}, {
		upsert: false
	});
};

export const remove = async (_id) => {
	return await Schema.remove({_id: mongoose.Types.ObjectId(_id)});
};

export const listById = async (ids, fields) => {
	const fieldsSelect = fields && Array.isArray(fields) && fields.length > 0 ? fields.join(' ') : fields;

	const listId = ids.reduce((arr, _id) => {
		arr.push(mongoose.Types.ObjectId(_id));
		return arr;
	}, []);

	const query = Schema.find({
		_id: {
			$in: listId
		}
	});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};
