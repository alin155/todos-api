/*
*
* 权限和用户数据模型
*
*/

const mongoose = require('np-mongodb').mongoose;

const authSchema = new mongoose.Schema({

	// 名字
	username: { type: String, required: true, unique: true},

	// 密码
	password: { type: String, required: true },

	// 角色
	roles: { type: Number, required: true },

	// 签名
	slogan: { type: String, default: '' },

	// 头像
	gravatar: { type: String, default: '' },

	// Todos
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;
