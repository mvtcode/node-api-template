"use strict";

/**
 * File: Messages
 * Created by: tanmv
 * Date: 27/03/2020
 * Time: 21:01
 * Template by tanmv
 */

import * as Service from "../services/Messages";
import * as UserService from "../services/Users";
import { toInt, toString } from '../libs/Parse';
import { isObjectId } from '../libs/Validate';
import publishMessage from '../publishMessage';

export const info = async (req, res) => {
	try {
		const id = toString(req.params.message_id, '');
		const info = await Service.info(id);
		res.sendJson({
			info
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const list = async (req, res) => {
	try {
		const user = req.user;
		const order_by = toString(req.query.order_by, '') || 'created_at';
		const user_id = toString(req.params.user_id, '');
		const order_by_direction = toInt(req.query.order_by_direction, -1);
		const page = toInt(req.query.page, 0);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);

		// validate data here can using joy
		if(!isObjectId(user_id)) {
			return res.sendError({
				error: 1,
				message: 'User id phải là objectId'
			});
		}

		const sort = {};
		sort[order_by] = order_by_direction;

		const list = await Service.listByUser(user._id, user_id, null, sort, page_size, page_size * page);
		const total = await Service.countByUser(user._id, user_id);

		res.sendJson({
			list,
			paging: {
				page, page_size, total
			}
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const listPrivate = async (req, res) => {
	try {
		const user = req.user;

		const listUserId = await Service.listPrivate(user._id);

		if (listUserId && listUserId.length > 0) {
			const listIdFriend = listUserId.filter(_id => {
				return _id !== user._id;
			});

			const listUser = await UserService.listById(listIdFriend, ['_id', 'name', 'avatar', 'role', 'sex']);

			if (listUser && listUser.length > 0) {
				const users = JSON.parse(JSON.stringify(listUser));
				for(const _user of users) {
					_user.last_message = await Service.getLastMessage(user._id, _user._id);
				}

				return res.sendJson({
					list: users
				});
			}
		}

		res.sendJson({
			list: null
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const update = async (req, res) => {
	try {
		const user = req.user;
		const id = toInt(req.params.id, 0);
		const name = toString(req.query.name, "");
		const category_id = toInt(req.query.category_id, 1);

		// validate data here

		const results = await Service.update(id, {
			name,
			category_id,
			updated_at: new Date(),
			updated_by: user.user_id
		});

		res.sendJson({
			data: results
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const insert = async (req, res) => {
	try {
		const body = req.body;
		const user = req.user;
		const user_id = toString(req.params.user_id, '');
		const message = toString(body.message, '');
		const attacks = body.attacks;
		const reply_id = body.reply_id;
		const reply_quote = body.reply_quote;

		// validate data here can using joy
		if(!isObjectId(user_id)) {
			return res.sendError({
				error: 1,
				message: 'User id phải là objectId'
			});
		}

		const newInfo = await Service.insert({
			user_id: user._id,
			user_name: user.name,
			user_avatar: user.avatar,
			group_id: [user._id, user_id],
			message,
			attacks,
			reply_id,
			reply_quote
		});

		res.sendJson({
			info: newInfo
		});

		const messageSk = newInfo.toJSON();
		messageSk.user_name = user.name;
		messageSk.user_avatar = user.avatar;
		messageSk.list_user_id = [user_id, user._id];
		publishMessage('send-message-private', messageSk);
	} catch (err) {
		return res.sendError(err);
	}
};

export const reaction = async (req, res) => {
	try {
		const user = req.user;
		const body = req.body;
		const id = toString(req.params.message_id, '');
		const user_id = toString(req.params.user_id, '');
		const content = toString(body.content, '');

		// validate data here can using joy
		if(!isObjectId(id)) {
			return res.sendError({
				error: 1,
				message: 'Message id phải là objectId'
			});
		}

		// get data
		const info = await Service.info(id, ['reacted']);

		if(!info) {
			return res.sendError({
				error: 1,
				message: 'Message không tồn tại'
			});
		}

		let reacted = info.reacted;
		if(!reacted) {
			reacted = [{
				user_id: user._id,
				content
			}];
		} else {
			let findOk = false;
			reacted.forEach( userReact => {
				if(userReact.user_id === user._id) {
					userReact.content = content;
					findOk = true;
				}
			});

			if(!findOk) {
				reacted.push({
					user_id: user._id,
					content
				});
			}
		}

		info.reacted = reacted;
		const result = info.save();

		res.sendJson({
			result
		});

		publishMessage('reaction-message-private', { list_user_id: [user_id, user._id], user_id: user._id, content, message_id: id });
	} catch (err) {
		return res.sendError(err);
	}
};

export const remove = async (req, res) => {
	try {
		const id = toInt(req.params.id, 0);

		// validate data here

		const results = await Service.remove(id);

		res.sendJson({
			data: results
		});
	} catch (err) {
		return res.sendError(err);
	}
};
