'use strict';

import express from 'express';

import {requestLogin, requestNotLogin, requestRole} from './middlewares/Authentication';
import checkCaptcha from './middlewares/Captcha';
import DecriptData from './middlewares/DecriptData';

import * as Users from './controllers/Users';
import * as GroupChats from './controllers/GroupChats';
import * as GroupChatMembers from './controllers/GroupChatMembers';
import * as GroupChatMessages from './controllers/GroupChatMessages';
import * as Messages from './controllers/Messages';
import * as GroupChatMessageReads from './controllers/GroupChatMessageReads';

const router = express.Router();

router.get('/users', requestLogin(), Users.list);

router.get('/users/:user_id', requestLogin(), Users.detail);
router.get('/users/:user_id/messages', requestLogin(), Messages.list);
router.post('/users/:user_id/messages', requestLogin(), Messages.insert);
router.get('/users/:user_id/messages/:message_id', requestLogin(), Messages.info);
router.post('/users/:user_id/messages/:message_id/reaction', requestLogin(), Messages.reaction);
// router.post('/users/:user_id/messages/:message_id/read', requestLogin(), Messages.read);

router.get('/user/profile', requestLogin(), Users.profile);
router.post('/user/login', requestNotLogin(), DecriptData(), checkCaptcha(), Users.login);
router.get('/user/logout', Users.logout);
router.post('/user/register', requestNotLogin(), checkCaptcha(), Users.register);
router.put('/user/update', requestLogin(), Users.update);
router.put('/user/change-password', requestLogin(), Users.updatePassword);
router.get('/user/messages', requestLogin(), Messages.listPrivate);

// router.get('/admin/users', requestLogin(), requestRole(['ADMIN']), Users.list);
// router.post('/admin/users', requestLogin(), requestRole(['ADMIN']), Users.add);
// router.get('/admin/users/:id', requestLogin(), requestRole(['ADMIN']), Users.detail);
// router.put('/admin/users/:id', requestLogin(), requestRole(['ADMIN']), Users.update);
// router.put('/admin/users/:id/password', requestLogin(), requestRole(['ADMIN']), Users.updatePassword);
// router.delete('/admin/users/:id', requestLogin(), requestRole(['ADMIN']), Users.remove);

router.get('/group-chats/', requestLogin(), GroupChats.list);
router.get('/group-chats/:id', requestLogin(), GroupChats.info);
router.post('/group-chats/', requestLogin(), GroupChats.insert);
router.put('/group-chats/:id', requestLogin(), GroupChats.update);
router.delete('/group-chats/:id', requestLogin(), GroupChats.remove);

router.delete('/group-chats/:group_id/leave', requestLogin(), GroupChatMembers.leave);

router.get('/group-chats/:group_id/members', requestLogin(), GroupChatMembers.list);
router.post('/group-chats/:group_id/members', requestLogin(), GroupChatMembers.insert);
router.delete('/group-chats/:group_id/members/:user_id', requestLogin(), GroupChatMembers.remove);

router.get('/group-chats/:group_id/messages', requestLogin(), GroupChatMessages.list);
router.post('/group-chats/:group_id/messages', requestLogin(), GroupChatMessages.insert);
router.get('/group-chats/:group_id/messages/read', requestLogin(), GroupChatMessageReads.infoByUser);
router.put('/group-chats/:group_id/messages/:id/read', requestLogin(), GroupChatMessageReads.updateRead);
router.put('/group-chats/:group_id/messages/:id/reaction', requestLogin(), GroupChatMessages.reaction);
// router.delete('/group-chats/:group_id/messages/:id', requestLogin(), GroupChatMessages.remove);

router.get('/group-chats/:group_id/media', requestLogin(), GroupChatMessages.listMedia);

export default router;
