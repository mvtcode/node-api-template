'use strict';

/**
 * File: GroupChatMessageReads
 * Created by: tanmv
 * Date: 22/03/2020
 * Time: 21:17
 * Template by tanmv
 */

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	_id: Schema.Types.ObjectId,
	group_id: Schema.Types.ObjectId,
	user_id: Schema.Types.ObjectId,
	message_id: Schema.Types.ObjectId,
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

const col_name = 'group_chat_message_reads';
schema.set('autoIndex', false);
export default mongoose.model(col_name, schema);
