'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
	_id: Schema.Types.ObjectId,
	name: String,
	username: {type: String, unique: true, index: true }, // email or mobile
	email: { type: String, unique: true, index: true },
	mobile: { type: String, unique: true, index: true },
	password: { type: String, required: true }, // select: false
	sex: Boolean,
	birthday: Date,
	avatar: String,

	// province_id: Number,
	// province_name:String,
	// district_id: Number,
	// district_name: String,
	// commune_id: Number,
	// commune_name: String,
	// address: String,

	role: {
		type: String,
		default: 'USER',
		enum: [
			'USER', // người dùng
			'ADMIN' // adminstrator
		]
	},

	status: {
		type: String,
		default: 'ACTIVATED',
		enum: [
			'ACTIVATED', // tài khoản đã được kích hoạt
			'PAUSED', // tài khoản bị treo, không được sử dụng hoặc ngắt tạm thời
			'DELETED' // tài khoản bị xóa
		]
	},

	created_at: {
		type: Date,
		default: Date.now
	},

	updated_at: {
		type: Date,
		default: Date.now
	}
});

const col_name = 'users';
schema.set('autoIndex', false);
export default mongoose.model(col_name, schema);
