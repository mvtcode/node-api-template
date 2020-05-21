"use strict";

/**
 * File: Messages
 * Created by: tanmv
 * Date: 27/03/2020
 * Time: 20:39
 * Template by tanmv
 */
import Schema from "../schemas/Messages";
import mongoose from "mongoose";

export const list = async (filters, fields = [], sort = {}, limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(" ") : fields;

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (sort && Object.keys(sort).length > 0) query.sort(sort);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const listByUser = async (user_id1, user_id2, fields = [], sort = {}, limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(" ") : fields;

	const query = Schema.find({
		$and: [
			{
				group_id: mongoose.mongo.ObjectId(user_id1)
			}, {
				group_id: mongoose.mongo.ObjectId(user_id2)
			}
		]
	});

	if (fieldsSelect) query.select(fieldsSelect);
	if (sort && Object.keys(sort).length > 0) query.sort(sort);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const listPrivate = async (user_id) => {
	return await Schema.distinct('group_id', { group_id: user_id });
};

export const info = async (_id, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(" ") : fields;

	const query = Schema.findOne({
		_id: mongoose.mongo.ObjectId(_id)
	});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const count = async (filters) => {
	return await Schema.count(filters);
};

export const countByUser = async (user_id1, user_id2) => {
	return await Schema.count({
		$and: [
			{
				group_id: mongoose.mongo.ObjectId(user_id1)
			}, {
				group_id: mongoose.mongo.ObjectId(user_id2)
			}
		]
	});
};

export const insert = async (info) => {
	if(!info._id) info._id = mongoose.Types.ObjectId();
	if (info.group_id.length > 0) {
		info.group_id = info.group_id.reduce((arr, user_id) => {
			arr.push(mongoose.mongo.ObjectId(user_id));
			return arr;
		}, []);
	}
	const newInfo = new Schema(info);
	return await newInfo.save();
};

export const update = async (info) => {
	return await Schema.update({ _id }, { $set: info }, { multi: false, upsert: false });
};

export const remove = async (_id) => {
	return await Schema.remove({ _id });
};
