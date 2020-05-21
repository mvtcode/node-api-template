'use strict';

/**
 * File: Schema
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 10:04
 * Template by tanmv
 */
import mongoose from 'mongoose';
import Schema from '../schemas/GroupChatMembers';

export const list = async (filters, fields = [], limit = 0, skip = 0) => {
	const fieldsSelect = fields && Array.isArray(fields) ? fields.join(' ') : fields;

	// refactor field type objectId
	if(filters && filters.group_id) filters.group_id = mongoose.mongo.ObjectId(filters.group_id);
	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);

	const query = Schema.find(filters || {});
	if (fieldsSelect) query.select(fieldsSelect);
	if (limit) query.limit(limit);
	if (skip) query.skip(skip);

	return await query.exec();
};

export const listMembersInGroup = async (group_id) => {
	return await Schema.aggregate([
		{
			$match: {
				group_id: mongoose.mongo.ObjectId(group_id)
			}
		}, {
			$lookup: {
				from: "users",
				localField: "user_id",
				foreignField: "_id",
				as: "user"
			}
		}, {
			$project: {
				_id: "$user._id",
				role: 1,
				name: "$user.name",
				avatar: "$user.avatar"
			}
		}
	]);
};

export const info = async (id, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	const query = Schema.findOne({
		_id: mongoose.mongo.ObjectId(id)
	});
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const findOne = async (filters, fields = []) => {
	const fieldsSelect = Array.isArray(fields) ? fields.join(' ') : fields;

	// refactor field type objectId
	if(filters && filters.group_id) filters.group_id = mongoose.mongo.ObjectId(filters.group_id);
	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);

	const query = Schema.findOne(filters);
	if (fieldsSelect) query.select(fieldsSelect);

	return await query.exec();
};

export const listGroup = async (filters) => {
	// return await Schema.find({user_id: mongoose.mongo.ObjectId(user_id)})
	// 	.populate({
	// 		path: 'group_chats',
	// 		select: '_id name'
	// 	}).exec();

	if(filters && filters.user_id) filters.user_id = mongoose.mongo.ObjectId(filters.user_id);

	if (filters.group_name) {
		const group_name = filters.group_name;
		delete filters.group_name;
		return await Schema.aggregate([
			{
				$match: filters
			}, {
				$lookup: {
					from: "group_chats",
					localField: "group_id",
					foreignField: "_id",
					as: "groups"
				}
			}, {
				$match: {
					"groups.name": new RegExp(group_name, 'i')
				}
			}, {
				$project: {
					_id: "$group_id",
					role: 1,
					name: "$groups.name",
					type: "$groups.type"
				}
			}
		]);
	} else {
		delete filters.group_name;
		return await Schema.aggregate([
			{
				$match: filters
			}, {
				$lookup: {
					from: "group_chats",
					localField: "group_id",
					foreignField: "_id",
					as: "groups"
				}
			}, {
				$project: {
					_id: "$group_id",
					role: 1,
					name: "$groups.name",
					type: "$groups.type"
				}
			}
		]);
	}
};


export const countList = async (where = {}) => {
	return await Schema.count(where);
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

export const removeByUser = async (group_id, user_id) => {
	return await Schema.remove({
		group_id: mongoose.mongo.ObjectId(group_id),
		user_id: mongoose.mongo.ObjectId(user_id)
	});
};

export const removeAllUser = async (group_id) => {
	return await Schema.remove({
		group_id: mongoose.mongo.ObjectId(group_id)
	});
};
