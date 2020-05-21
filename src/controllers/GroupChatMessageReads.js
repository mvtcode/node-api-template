'use strict';

/**
 * File: GroupChatMessageReads
 * Created by: tanmv
 * Date: 22/03/2020
 * Time: 22:03
 * Template by tanmv
 */

import * as Service from '../services/GroupChatMessageReads';
import { toInt, toString } from '../libs/Parse';
import { isObjectId } from "../libs/Validate";

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
		const group_id = req.params.group_id;
		const order_by = toString(req.query.order_by, '') || 'created_at';
		const order_by_direction = toInt(req.query.order_by_direction, -1);
		const page = toInt(req.query.page, 1);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);

		const filters = { group_id };
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

export const infoByUser = async (req, res) => {
	try {
		const user = req.user;
		const group_id = toString(req.params.group_id, '');

		const info = await Service.infoByUser(user._id, group_id);
		res.sendJson({
			info
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const updateRead = async (req, res) => {
	try {
		const user = req.user;
		const group_id = toString(req.params.group_id, '');
		const message_id = toString(req.params.id, '');

		// validate data here
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		if(!isObjectId(message_id)) {
			return res.sendError({
				error: 1,
				message: 'Message id phải là objectId'
			});
		}

		const result = await Service.updateRead(group_id, user._id, message_id);

		res.sendJson({
			result
		});
	} catch (err) {
		return res.sendError(err);
	}
};

export const remove = async (req, res) => {
	try {
		const id = toString(req.params.id, '');

		// validate data here

		const result = await Service.remove(id);

		res.sendJson({
			result
		});
	} catch (err) {
		return res.sendError(err);
	}
};
