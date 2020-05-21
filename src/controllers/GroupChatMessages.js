'use strict';

/**
 * File: GroupChatMessages
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 15:25
 * Template by tanmv
 */

import { toInt, toString } from '../libs/Parse';
import { isObjectId } from '../libs/Validate';
import * as Service from '../services/GroupChatMessages';
import * as GroupChatService from '../services/GroupChats';
import publishMessage from '../publishMessage';

export const info = async (req, res) => {
	try {
		const id = toString(req.params.id, '');
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
		const group_id = toString(req.params.group_id, '');
		const order_by = toString(req.query.order_by, '') || 'created_at';
		const order_by_direction = toInt(req.query.order_by_direction, -1);
		const page = toInt(req.query.page, 0);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		// if(user_id && !isObjectId(user_id)) {
		// 	return res.sendError({
		// 		error: 1,
		// 		message: 'User id phải là objectId'
		// 	});
		// }

		const filters = {group_id};
		// if (user_id) filters.user_id = user_id;
		const sort = {};
		sort[order_by] = order_by_direction;

		const list = await Service.list(filters, [], sort, page_size, page * page_size);
		const total = await Service.countList(filters);

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
		const group_id = toString(req.params.group_id, '');
		const order_by = toString(req.query.order_by, '') || 'created_at';
		const order_by_direction = toInt(req.query.order_by_direction, -1);
		const page = toInt(req.query.page, 0);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		// if(user_id && !isObjectId(user_id)) {
		// 	return res.sendError({
		// 		error: 1,
		// 		message: 'User id phải là objectId'
		// 	});
		// }

		const filters = {group_id};
		// if (user_id) filters.user_id = user_id;
		const sort = {};
		sort[order_by] = order_by_direction;

		const list = await Service.list(filters, [], sort, page_size, page * page_size);
		const total = await Service.countList(filters);

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

export const insert = async (req, res) => {
	try {
		const body = req.body;
		const user = req.user;
		const message = toString(body.message, '');
		const group_id = toString(req.params.group_id, '');
		const attacks = body.attacks;
		const reply_id = body.reply_id;
		const reply_quote = body.reply_quote;

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		const newInfo = await Service.insert({
			user_id: user._id,
			user_name: user.name,
			user_avatar: user.avatar,
			group_id,
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
		publishMessage('send-message', messageSk);
	} catch (err) {
		return res.sendError(err);
	}
};

export const insertPrivate = async (req, res) => {
	try {
		const body = req.body;
		const user = req.user;
		const message = toString(body.message, '');
		const user_id = toString(req.params.user_id, '');
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

		// get group chat private
		const groupInfo = await GroupChatService.findOnePrivateById(user._id, user_id);

		const newInfo = await Service.insert({
			user_id: user._id,
			// user_name: user.name,
			// user_avatar: user.avatar,
			group_id: groupInfo._id,
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
		messageSk.list_user_id = [user._id, user_id];
		publishMessage('send-message-private', messageSk);
	} catch (err) {
		return res.sendError(err);
	}
};

export const insertPrivateReaction = async (req, res) => {
	try {
		const user = req.user;
		const id = req.params.message_id;
		const user_id = toString(req.params.user_id, '');
		const icon = toString(req.body.icon, '');

		// validate data here can using joy
		if(!isObjectId(user_id)) {
			return res.sendError({
				error: 1,
				message: 'User id phải là objectId'
			});
		}

		if(!isObjectId(id)) {
			return res.sendError({
				error: 1,
				message: 'Message id phải là objectId'
			});
		}

		// get group chat private
		const groupInfo = await GroupChatService.findOnePrivateById(user._id, user_id);

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
				content: icon
			}]
		} else {
			let findOk = false;
			reacted.forEach( userReact => {
				if(userReact.user_id === user._id) {
					userReact.content = icon;
					findOk = true;
				}
			});

			if(!findOk) {
				reacted.push({
					user_id: user._id,
					content: icon
				});
			}
		}

		info.reacted = reacted;
		const result = info.save();

		res.sendJson({
			result
		});

		publishMessage('reaction-message-private', { group_id: groupInfo._id, list_user_id: groupInfo.list_user_id, user_id: user._id, content: icon, message_id: id });
	} catch (err) {
		return res.sendError(err);
	}
};

export const reaction = async (req, res) => {
	try {
		const user = req.user;
		const id = req.params.id;
		const group_id = req.params.group_id;
		const content = toString(req.body.content, '');

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
				content: icon
			}]
		} else {
			let findOk = false;
			reacted.forEach( userReact => {
				if(userReact.user_id === user._id) {
					userReact.content = icon;
					findOk = true;
				}
			});

			if(!findOk) {
				reacted.push({
					user_id: user._id,
					content: icon
				});
			}
		}

		info.reacted = reacted;
		const result = info.save();

		res.sendJson({
			result
		});

		publishMessage('reaction-message', { group_id, user_id: user._id, content: icon, message_id: id });
	} catch (err) {
		return res.sendError(err);
	}
};

export const remove = async (req, res) => {
	try {
		const id = toInt(req.params.id, 0);

		// validate data here

		const result = await Service.remove(id);

		res.sendJson({
			result
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const listMedia = async (req, res) => {
	try {
		const group_id = req.params.group_id;
		// const user_id = req.params.user_id;
		const order_by = toString(req.query.order_by, '') || 'created_at';
		const order_by_direction = toInt(req.query.order_by_direction, -1);
		const page = toInt(req.query.page, 0);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		// if(user_id && !isObjectId(user_id)) {
		// 	return res.sendError({
		// 		error: 1,
		// 		message: 'User id phải là objectId'
		// 	});
		// }

		const filters = {group_id, attacks: {
			$ne: null,
			$not: { $size: 0 }, 
		}};
		const sort = {};
		sort[order_by] = order_by_direction;

		const list = await Service.list(filters, ['_id', 'user_id', 'attacks', 'created_at', 'updated_at'], sort, page_size, page * page_size);
		const total = await Service.countList(filters);

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
