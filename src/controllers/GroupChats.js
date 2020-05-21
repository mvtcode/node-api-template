'use strict';

/**
 * File: GroupChats
 * Created by: tanmv
 * Date: 03/03/2020
 * Time: 13:26
 * Template by tanmv
 */

import { toInt, toString } from '../libs/Parse';
import { isObjectId } from '../libs/Validate';

import publishMessage from '../publishMessage';

import * as Service from '../services/GroupChats';
import * as GroupChatMemberService from '../services/GroupChatMembers';
import { getLastMessageOfGroup, removeAllMessage } from '../services/GroupChatMessages';
import { findOne as findRead } from '../services/GroupChatMessageReads';

export const info = async (req, res) => {
	try {
		const user = req.user;
		const id = toString(req.params.id, '');

		if (!isObjectId(id)) {
			return res.sendError({
				error: 1,
				message: 'Id không đúng định dạng ObjectId'
			});
		}

		// validate member in group
		const infoMember = await GroupChatMemberService.findOne({ group_id: id, user_id: user._id });
		if (!infoMember) {
			return res.sendError({
				error: 6,
				message: 'Bạn không còn trong group'
			});
		}

		const info = (await Service.info(id)).toJSON();

		if (info) {
			// select member in group
			// info.members = await GroupChatMemberService.list({
			// 	group_id: id
			// });

			info.members = await GroupChatMemberService.listMembersInGroup(id);

			//select read
			const readInfo = await findRead({
				group_id: id, user_id: user._id
			}, ['message_id']);
			info.read = readInfo ? readInfo.message_id : null;
		}

		res.sendJson({
			info
		});
	} catch (err) {
		return res.sendError(err);
	}
};

// List group chat by user
export const list = async (req, res) => {
	try {
		const user = req.user;
		// const list = await Service.listByUser(user._id);
		const group_name = toString(req.query.group_name, '').trim();

		const list = await GroupChatMemberService.listGroup({user_id: user._id, group_name });

		// get last message of group
		if ( list && list.length > 0 ) {
			for ( const _info of list ) {
				_info.last_message = await getLastMessageOfGroup( _info._id );
			}
		}
		// end get last message of group

		res.sendJson({
			list
		});
	} catch (err) {
		return res.sendError(err);
	}
};

// create group chat by user
export const insert = async (req, res) => {
	try {
		const user = req.user;
		const body = req.body;
		const name = toString(body.name, '');
		// const type = toString(body.type, 'PRIVATE');
		const members = body.members || [];

		// validate data here
		// if (!['PRIVATE', 'PUBLIC'].includes(type)) {
		// 	return res.sendError({
		// 		error: 2,
		// 		message: 'Type của group không đúng'
		// 	});
		// }

		if (members && !Array.isArray(members)) {
			return res.sendError({
				error: 3,
				message: 'Member group phải là array'
			});
		}

		// validate user id
		if (members && members.length > 0) {
			const ids = members.filter(member => {
				return !isObjectId(member);
			});
			if (ids && ids.length > 0) {
				return res.sendError({
					error: 4,
					message: 'Member id phải là objectId'
				});
			}
		}

		// insert to group chat
		const groupChatInfo = await Service.insert({ name, type: 'PUBLIC' });

		// insert me to group
		await GroupChatMemberService.insert({
			group_id: groupChatInfo._id,
			user_id: user._id,
			role: 'ADMIN' //type === 'PUBLIC' ? 'ADMIN' : 'USER'
		});

		// insert to group chat member insertMany
		for (const member of members) {
			try {
				await GroupChatMemberService.insert({
					group_id: groupChatInfo._id,
					user_id: member,
					role: 'USER'
				});
			} catch(e) {
				console.error(e);
			}
		}

		delete groupChatInfo.members;
		res.sendJson({
			info: groupChatInfo
		});

		publishMessage('create-group', { _id: groupChatInfo._id, group_id: groupChatInfo._id, user_id: user._id, name, type });
	} catch (err) {
		return res.sendError(err);
	}
};

export const update = async (req, res) => {
	try {
		const user = req.user;
		const id = toString(req.params.id, '');
		const name = toString(req.body.name, '');
		const avatar = toString(req.body.avatar, '');

		// validate data here

		const result = await Service.update(id, {
			name,
			avatar,
			updated_at: new Date()
		});

		res.sendJson({
			result
		});

		publishMessage('update-group', { group_id: id, user_id: user._id, name, avatar });
	} catch (err) {
		return res.sendError(err);
	}
};

export const remove = async (req, res) => {
	try {
		const user = req.user;
		const id = toString(req.params.id, '');

		// validate data here

		// check permisstion
		const infoMember = await GroupChatMemberService.findOne({ group_id: id, user_id: user._id });
		if (infoMember) {
			if (infoMember.role === 'ADMIN') {
				const result = await Service.remove(id);

				res.sendJson({
					result
				});

				publishMessage('remove-group', { group_id: id });

				setTimeout(async () => {
					await GroupChatMemberService.removeAllUser(id);
					await removeAllMessage(id);
				}, 2000);
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
