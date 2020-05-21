'use strict';

/**
 * File: GroupChatMembers
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 14:54
 * Template by tanmv
 */

import { toInt, toString } from '../libs/Parse';
import { isObjectId } from '../libs/Validate';
import * as Service from '../services/GroupChatMembers';
import * as GroupChats from '../services/GroupChats';
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

// list member in group
export const list = async (req, res) => {
	try {
		const group_id = req.params.group_id;

		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		const list = await Service.list({group_id: group_id});

		res.sendJson({
			list
		});
	} catch (err) {
		return res.sendError(err);
	}
};

// invite member to group
export const insert = async (req, res) => {
	try {
		const user = req.user;
		const body = req.body;
		const group_id = req.params.group_id;
		const user_id = body.user_id;

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}
		if(!isObjectId(user_id)) {
			return res.sendError({
				error: 1,
				message: 'User id phải là objectId'
			});
		}

		// insert to db
		const info = await Service.insert({
			group_id, user_id
		});

		res.sendJson({
			info
		});

		publishMessage('invite-member', { group_id, user_id: user._id, invite_id: user_id });
	} catch (err) {
		return res.sendError(err);
	}
};

// self leave group
export const leave = async (req, res) => {
	try {
		const user = req.user;
		const group_id = req.params.group_id;

		// validate data here can using joy
		if(!isObjectId(group_id)) {
			return res.sendError({
				error: 1,
				message: 'Group id phải là objectId'
			});
		}

		// check group info
		const groupInfo = await GroupChats.info(group_id, ['type']);

		if (!groupInfo) return res.sendError({
			error: 7,
			message: 'Group không tồn tại'
		});

		if (groupInfo.type === 'PRIVATE') return res.sendError({
			error: 9,
			message: 'Không thể rời group PRIVATE'
		});
		// end check group info

		const infoMember = await Service.findOne({ group_id, user_id: user._id });

		if (infoMember) {
			// const result = await infoMember.remove();
			const result = await Service.removeByUser( group_id, user._id );
			res.sendJson({
				result
			});
		} else {
			res.sendError({
				error: 6,
				message: 'Bạn không còn trong group'
			});
		}

		publishMessage('leave-member', { group_id, user_id: user._id });
	} catch (err) {
		return res.sendError(err);
	}
};

export const remove = async (req, res) => {
	try {
		const user = req.user;
		const group_id = req.params.group_id;
		const user_id = req.params.user_id;

		// validate data here

		// check group info
		const groupInfo = await GroupChats.info(group_id, ['type']);

		if (!groupInfo) return res.sendError({
			error: 7,
			message: 'Group không tồn tại'
		});

		if (groupInfo.type === 'PRIVATE') return res.sendError({
			error: 9,
			message: 'Không thể xóa group PRIVATE'
		});
		// end check group info

		// check permission admin
		const infoMember = await Service.findOne({ group_id, user_id: user._id });
		if (infoMember) {
			if (infoMember.role === 'ADMIN') {
				const result = await Service.removeByUser( group_id, user._id );
				res.sendJson({
					result
				});
				publishMessage('remove-member', { group_id, user_id, remove_by_id: user._id });
			} else {
				res.sendError({
					error: 8,
					message: 'Bạn không quyền thực hiện thao tác này'
				});
			}
		} else {
			res.sendError({
				error: 6,
				message: 'Bạn không còn trong group'
			});
		}
	} catch (err) {
		return res.sendError(err);
	}
};
