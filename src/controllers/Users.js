'use strict';

import BaseJoi from 'joi';
import JoiDateExtensions  from 'joi-date-extensions';

import { toInt, toString } from '../libs/Parse';
import * as Service from '../services/Users';
import { langValidate } from '../libs/Validate';
import { sign, checkToken } from '../middlewares/Authentication';
import { getPassword, getNameFromEmail, getNameFromMobile } from '../libs/Utils';
// import { sha256 } from '../libs/Encript';
import { isPhoneNumber, isEmail } from "../libs/Validate";
import config from '../../config';

const Joi = BaseJoi.extend(JoiDateExtensions);

const option_cookie_socket = JSON.parse(JSON.stringify(config.token.option));
option_cookie_socket.httpOnly = false;

// const mapStatus = {
// 	'CREATED': 'Tài khoản chưa được kích hoạt',
// 	'WAITING_ACTIVE': 'Tài khoản đang được chờ duyệt',
// 	'ACTIVATED': 'Tài khoản đã được kích hoạt',
// 	'REJECTED': 'Tài khoản không được duyệt',
// 	'WAITTING_REACTIVE': 'Tài khoản đang được chờ set duyệt lại',
// 	'PAUSED': 'Tài khoản đã tạm dừng',
// 	'DELETED': 'Tài khoản đã bị xóa'
// };

export const login = async (req, res) => {
	try {
		const body = req.body;

		// const {error, value} = Joi.validate(body, Joi.object({
		// 	email: Joi.string().email().trim().required(),
		// 	password: Joi.string().min(6).max(30).trim().required()
		// }), langValidate);

		const username = toString(body.username, '').trim(); // email or phone number
		const password = toString(body.password, '').trim();

		// validate email, phone, password here!

		const info = await Service.infoByUsername(username);
		if(info) {
			if(info.password === getPassword(password)) {
				if(info.status === 'ACTIVATED') {
					const infoUser = info.toJSON();
					delete infoUser.password;
					delete infoUser.__v;
					delete infoUser.created_at;
					delete infoUser.updated_at;

					const token = sign(infoUser);

					// set token via cookie
					res.cookie(config.token.cookie_name, token, config.token.option);

					// set token-socket via cookie
					res.cookie('token-socket', sign({ _id: infoUser._id }), option_cookie_socket);

					// response request
					res.sendJson({
						info: infoUser
					});
				} else {
					res.sendError({
						error: 12,
						message: 'Tài khoản của bạn không hợp lệ'
					});
				}
			} else {
				res.sendError({
					error: 10,
					message: 'Email, số điện thoại hoặc mật khẩu không đúng'
				});
			}
		} else {
			res.sendError({
				error: 10,
				message: 'Email, số điện thoại hoặc mật khẩu không đúng'
			});
		}
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

export const logout = async (req, res) => {
	try {
		res.clearCookie('token-socket', option_cookie_socket);
		res.clearCookie(config.token.cookie_name, config.token.option);
		res.sendJson({
			result: true
		});
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

export const profile = async (req, res) => {
	try {
		const info = await Service.info(req.user._id, ['_id', 'name', 'email', 'mobile', 'sex', 'birthday', 'role', 'status', 'created_at', 'avatar']);
		delete info.password;
		res.sendJson({
			// info: req.user
			info
		});
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

export const register = async (req, res) => {
	try {
		const body = req.body;

		const {error, value} = Joi.validate(body, Joi.object({
			username: Joi.string().required(), // mobile or email
			// email: Joi.string().email().trim(),
			// mobile: Joi.string().trim().regex(/^0\d{9}$/),
			password: Joi.string().min(6).max(30).trim().required(),
			repassword: Joi.string().min(6).max(30).trim().equal(Joi.ref('password')).required(),
			sex: Joi.boolean().strict().required(),
			birthday: Joi.date().format('YYYY-MM-DD')
		}), langValidate);

		if(!error) {
			if (isPhoneNumber(value.username)) {
				value.mobile = value.username;
				value.name = getNameFromMobile(value.username);
			} else if (isEmail(value.username)) {
				value.email = value.username;
				value.name = getNameFromEmail(value.username);
			} else {
				return res.sendError({
					error: 1,
					message: 'Vui lòng nhập email hoặc số điện thoại'
				});
			}

			if(await Service.countList({username: value.username}) > 0) {
				return res.sendError({
					error: 20,
					message: 'Người dùng này đã tồn tại'
				});
			}

			const newInfo = await Service.insert({
				username: value.username,
				name: value.name,
				email: value.email,
				mobile: value.mobile,
				password: getPassword(value.password),
				status: 'ACTIVATED'
			});
			res.sendJson({
				info: {
					_id: newInfo._id,
					name: newInfo.name,
					username: newInfo.username,
					mobile: newInfo.mobile,
					email: newInfo.email,
					status: newInfo.status
				}
			});
		} else {
			res.sendError({
				error: 3,
				message: error
			});
		}
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

// export const getActive = async (req, res) => {
// 	try {
// 		const code = toString(req.query.code, '');
// 		if(code) {
// 			const info = checkToken(code);
// 			if(info) {
// 				const userInfo = await Service.info(info._id, ['_id name email active_email status']);
// 				if(userInfo) {
// 					if(!userInfo.active_email) {
// 						if(userInfo.status === 'CREATED') {
// 							res.sendJson({
// 								info: userInfo
// 							});
// 						} else {
// 							res.sendError({
// 								error: 90,
// 								message: mapStatus[userInfo.status] || 'Trạng thái tài khoản không hợp lệ'
// 							});
// 						}
// 					} else {
// 						res.sendError({
// 							error: 22,
// 							message: 'Email đã được kích hoạt từ trước, nên bạn không cần thực hiện thao tác này nữa'
// 						});
// 					}
// 				} else {
// 					res.sendError({
// 						error: 21,
// 						message: 'Email Không tồn tại'
// 					});
// 				}
// 			} else {
// 				res.sendError({
// 					error: 80,
// 					message: 'Token Không hợp lệ'
// 				});
// 			}
// 		} else {
// 			res.sendJson({
// 				info: req.user
// 			});
// 		}
// 	} catch (e) {
// 		res.sendError({
// 			error: 1000,
// 			message: e.message || e.stack || e
// 		});
// 	}
// };

export const active = async (req, res) => {
	try {
		const body = req.body;

		const {error, value} = Joi.validate(body, Joi.object({
			code: Joi.string().strict().trim().required(),
			name: Joi.string().min(3).max(30).trim().required(),
			mobile: Joi.string().min(3).max(30).trim().required(),
			sex: Joi.boolean().strict().required(),
			birthday: Joi.date().format('YYYY-MM-DD'),
			province_id: Joi.number().greater(0).strict().required(),
			province_name: Joi.string().trim().required(),
			district_id: Joi.number().greater(0).strict().required(),
			district_name: Joi.string().trim().required(),
			school_id: Joi.number().greater(0).strict().required(),
			school_name: Joi.string().trim().required(),
			class_id: Joi.number().strict(),
			class_name: Joi.string().trim(),
			address: Joi.string().trim()
		}), langValidate);

		if(!error) {
			const token = checkToken(value.code);
			if(token) {
				value.status = 'WAITING_ACTIVE';
				const result = await Service.Update(token._id, value);
				res.sendJson({
					result
				});
			} else {
				res.sendError({
					error: 80,
					message: 'Token Không hợp lệ'
				});
			}
		} else {
			res.sendError({
				error: 3,
				message: error
			});
		}
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

/**
 * List user for admin
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export const list = async (req, res) => {
	try {
		const page = toInt(req.query.page, 0);
		const page_size = Math.min(toInt(req.query.page_size, 25), 200);
		const search = toString(req.query.textSearch, '');
		const where = search ? { $or:[
			{
				username: new RegExp(search, 'i')
			}, {
				name: new RegExp(search, 'i')
			}
		]} : {};

		const list = await Service.list(where, ['_id', 'name', 'sex', 'birthday', 'role', 'status', 'avatar'], page_size, page);
		const total = await Service.countList(where);

		res.sendJson({
			list,
			paging: {
				page, page_size, total
			}
		});
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

// export const add = async (req, res) => {
// 	try {
// 		const body = req.body;
//
// 		const {error, value} = Joi.validate(body, Joi.object({
// 			name: Joi.string().trim().required(),
// 			email: Joi.string().email().trim().required(),
// 			password: Joi.string().min(6).max(30).trim().required(),
// 			mobile: Joi.string().trim(),
// 			sex: Joi.boolean(),
// 			birthday: Joi.date().format('YYYY-MM-DD'),
// 			role: Joi.only('USER', 'ADMIN').required()
// 		}), langValidate);
//
// 		if(!error) {
// 			const count = await Service.countList({email: value.email});
// 			if(count === 0) {
// 				value.status = 'ACTIVATED';
// 				value.password = getPassword(value.password);
// 				const newInfo = Service.insert(value);
// 				res.sendJson({
// 					info: newInfo
// 				});
// 			} else {
// 				res.sendError({
// 					error: 20,
// 					message: 'Email đã tồn tại trong hệ thống'
// 				});
// 			}
// 		} else {
// 			res.sendError({
// 				error: 3,
// 				message: error
// 			});
// 		}
// 	} catch (e) {
// 		res.sendError({
// 			error: 1000,
// 			message: e.message || e.stack || e
// 		});
// 	}
// };

export const detail = async (req, res) => {
	try {
		const id = toString(req.params.user_id, '');
		const info = await Service.info(id, ['_id', 'name', 'sex', 'avatar', 'role']);
		res.sendJson({
			info
		});
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

export const update = async (req, res) => {
	try {
		const user = req.user;
		const body = req.body;
		const {error, value} = Joi.validate(body, Joi.object({
			name: Joi.string().trim().required(),
			// mobile: Joi.string().trim(),
			// email: Joi.string().email().trim(),
			sex: Joi.boolean(),
			birthday: Joi.date().format('YYYY-MM-DD'),
			avatar: Joi.string().trim()
		}), langValidate);

		if(!error) {
			const result = await Service.update(user._id, value);
			res.sendJson({
				result
			});
		} else {
			res.sendError({
				error: 3,
				message: error
			});
		}
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
	}
};

export const updatePassword = async (req, res) => {
	try {
		const user = req.user;
		const body = req.body;
		const {error, value} = Joi.validate(body, Joi.object({
			old_password: Joi.string().min(6).max(30).trim().required(),
			password: Joi.string().min(6).max(30).trim().required(),
			repassword: Joi.string().min(6).max(30).trim().equal(Joi.ref('password')).required(),
		}), langValidate);

		if(!error) {
			const info = await Service.info(user._id, ['password']);
			console.log(info, info.password, getPassword(value.old_password));
			if (info) {
				const currentPassword = info.password;
				if (currentPassword === getPassword(value.old_password)) {
					info.password = getPassword(value.password);
					const result = await info.save(); //await Service.update(id, {password: getPassword(value.password)});

					res.sendJson({
						result: result ? 1 : 0
					});
				} else {
					res.sendError({
						error: 6,
						message: 'Mật khẩu cũ không đúng'
					});
				}
			} else {
				res.sendError({
					error: 5,
					message: 'Không tìm thấy thông tin user'
				});
			}
		} else {
			res.sendError({
				error: 3,
				message: error
			});
		}
	} catch (e) {
		res.sendError({
			error: 1000,
			message: e.message || e.stack || e
		});
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
