'use strict';

/**
 * File: GroupChats
 * Created by: tanmv
 * Date: 01/03/2020
 * Time: 06:44
 * Template by tanmv
 */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	alias: String,
	avatar: String,

	// type: {
	// 	type: String,
	// 	default: 'PRIVATE',
	// 	enum: [
	// 		'PRIVATE',
	// 		'PUBLIC'
	// 	]
	// },

	// members: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'group_chat_members'
	// }],
	// read: Schema.Types.ObjectId, // extend for user read
	// list_user_id: [Schema.Types.ObjectId], // use for PRIVATE group chat

	members: [{
		type: Schema.Types.Mixed
	}],

	created_at: {
		type: Date,
		default: Date.now
	},

	updated_at: {
		type: Date,
		default: Date.now
	}
});

schema.statics.findAndModify = (query, sort, doc, options, callback) => {
	return this.collection.findAndModify(query, sort, doc, options, callback);
};

const col_name = 'group_chats';
schema.set('autoIndex', false);
export default mongoose.model(col_name, schema);
