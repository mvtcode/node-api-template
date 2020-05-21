'use strict';

/**
 * File: consts
 * Created by: tanmv
 * Date: 09/03/2020
 * Time: 14:34
 *
 */

module.exports = {
	redis_key: {
		listGroupMember: (group_id) => {
			return `list_group_member_${group_id}`;
		},
		lastGroupMessage: ( group_id ) => {
			return `group_last_message_${ group_id }`;
		},
		lastMessage: ( user_id1, user_id2 ) => {
			const ids = [user_id1, user_id2];
			return `last_message_${ ids.sort().join('_') }`;
		},
	}
};
