/*
*
* 权限和用户数据模型
*
*/

const mongoose = require('np-mongodb').mongoose;

const authSchema = new mongoose.Schema({

	username: { type: String, required: true, unique: true},

	password: { type: String, required: true },

	slogan: { type: String, default: '' },

	gravatar: { type: String, default: '' },

	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}]
});

const Auth = mongoose.model('Auth', authSchema);
module.exports = Auth;
