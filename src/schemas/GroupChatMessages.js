'use strict';

/**
 * File: GroupChatContents
 * Created by: tanmv
 * Date: 01/03/2020
 * Time: 06:49
 * Template by tanmv
 */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	_id: Schema.Types.ObjectId,
	group_id: Schema.Types.ObjectId,
	user_id: Schema.Types.ObjectId,
	// user_name: String,
	// user_avatar: String,
	reply_id: Schema.Types.ObjectId, // reply message chat id
	reply_quote: Schema.Types.Mixed,
	message: String,
	attacks: [{
		type: {
			type: String,
			default: 'TEXT',
			enum: [
				'TEXT',
				'IMAGE',
				'FILE',
				'AUDIO',
				'VIDEO',
				'CONTACT',
				'ETC'
			]
		},
		content: Schema.Types.Mixed,
		thumnail: { type: String, default: '' }
	}],
	reacted: [
		{
			user_id: String, // Schema.Types.ObjectId,
			content: String
		}
	],

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

const col_name = 'group_chat_messages';
schema.set('autoIndex', false);
export default mongoose.model(col_name, schema);
