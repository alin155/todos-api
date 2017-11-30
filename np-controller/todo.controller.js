/*
*
* todo控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Todo = require('np-model/todo.model');
const User = require('np-model/user.model');
const Record = require('np-model/record.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const todoCtrl = {};

// get todos by jwt-tokenUsername
todoCtrl.GET = (req, res) => {

	User.find({username: req.tokenUsername}, '_id')
	.then(([userId = {}]) => {
		Todo.find({user: userId}, '-__v')
		.then(result => {
			handleSuccess({ res, result, message: 'get todos success!' });
		})
		.catch(err => {
			handleError({ res, err, message: 'get todos err!' });
		})
	})
	.catch(err => {
		handleError({ res, err, message: 'get todos: jwt err!' });
	})
};

// add todo by title
todoCtrl.POST = (req, res) => {

	const todo = req.body;
	
	if (!todo.title) {
		handleError({ res, err: 'req body err!', message: 'todo title is required' });
		return false;
	}

	User.find({username: req.tokenUsername}, '_id')
	.then(([userId = {}]) => {
		todo.user = userId;
		new Todo(todo).save()
		.then((result = user) => {
			User.findByIdAndUpdate(userId, {$addToSet: {todos: {$each: [result._id]}}}, { new: true })
			.then(result => {
				handleSuccess({ res, result: 'add todo success', message: 'update User success' });
			})
			.catch(err => {
				handleError({ res, err, message: 'add todo success, but update User err' });
			})
		})
		.catch(err => {
			handleError({ res, err, message: 'add todo err!' });
		})
	})
	.catch(err => {
		handleError({ res, err, message: 'post todos: jwt err!' });
	})
};

// change todo by _id
todoCtrl.PUT = (req, res) => {
	const todo = req.body;
	
	if (!todo._id) {
		handleError({ res, err: 'req body err!', message: 'todo _id is required' });
		return false;
	}

	delete todo.user
	delete todo.records

	Todo.findByIdAndUpdate(todo._id, todo, {new: true})
	.then(result => {
		handleSuccess({ res, result, message: 'update todo success' });
	})
	.catch(err => {
		handleError({ res, err, message: 'update todo err' });
	})
};

// delete todo by _id
todoCtrl.DELETE = (req, res) => {
	const todo = req.body;
	
	if (!todo._id) {
		handleError({ res, err: 'req body err!', message: 'todo _id is required' });
		return false;
	}

	// update user.todos
	User.update({todos: {$in: [todo._id]}}, {$pull: {todos: todo._id}})
	.catch(err => {
		handleError({ res, err, message: 'update user err' });
		return false;
	})

	// delete records
	Todo.find({_id: todo._id}, '-_id records')
	.then(([result]) => {
		Record.remove({_id: {$in: result.records}})
		.catch(err => {
			handleError({ res, err, message: 'delete records err' });
		})
	})
	.catch(err => {
		handleError({ res, err: '_id is\'t exist', message: 'delete records err' });
		return false;
	})

	Todo.findByIdAndRemove(todo._id)
	.then(result => {
		handleSuccess({ res, result: 'success', message: 'delete todo success' });
	})
	.catch(err => {
		handleError({ res, err: '_id is\'t exist', message: 'delete todo err3' });
	})
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: todoCtrl })};
