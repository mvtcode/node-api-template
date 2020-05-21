'use strict';

/**
 * File: GroupChatMembers
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 06:14
 * Template by tanmv
 */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	_id: Schema.Types.ObjectId,
	// group_id: Schema.Types.ObjectId,
	group_id: { type: Schema.Types.ObjectId, ref: 'group_chats' },
	user_id: Schema.Types.ObjectId,
	role: {
		type: String,
		default: 'USER',
		enum: [
			'USER', // người dùng
			'ADMIN' // adminstrator
		]
	}
});

schema.statics.findAndModify = (query, sort, doc, options, callback) => {
	return this.collection.findAndModify(query, sort, doc, options, callback);
};

const col_name = 'group_chat_members';
schema.set('autoIndex', false);
export default mongoose.model(col_name, schema);
