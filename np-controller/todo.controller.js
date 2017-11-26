/*
*
* todo控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Todo = require('np-model/todo.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const todoCtrl = {};

// 获取个人信息
todoCtrl.GET = (req, res) => {
	Todo.find({}, '_id title')
	.then(([result = {}]) => {
		handleSuccess({ res, result, message: '用户资料获取成功' });
	})
	.catch(err => {
		handleError({ res, err, message: '获取失败' });
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: todoCtrl })};
