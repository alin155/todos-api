/*
*
* record控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Todo = require('np-model/todo.model');
const Record = require('np-model/record.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const recordCtrl = {};

// get records by todo._id
recordCtrl.GET = (req, res) => {
   
    console.log(req.query)

    let todoId = req.query._id;

    if (!todoId) {
        handleError({ res, err: 'req query err!', message: 'todo._id is required' });
        return false;
    }

    Record.find({todoId: todoId}, '-__v')
    .then(result => {
        handleSuccess({ res, result, message: 'get records success!' });
    })
    .catch(err => {
        handleError({ res, err, message: 'get records: _id err!' });
    })
};

// add record by text and todo._id
recordCtrl.POST = (req, res) => {

    const record = req.body;
    
    if (!record.text || !record.todoId) {
        handleError({ res, err: 'req body err!', message: 'record text is required' });
        return false;
    }

    new Record(record).save()
    .then(result => {
        Todo.findByIdAndUpdate(result.todoId, {$addToSet: {records: {$each: [result._id]}}}, {new: true})
        .then(result => {
            handleSuccess({ res, result: 'add record success', message: 'update todo success' });
        })
        .catch(err => {
            handleError({ res, err, message: 'add record success, but update todo err' });
        })
    })
    .catch(err => {
		handleError({ res, err, message: 'post record: jwt err!' });
	})
};

// change record by _id
recordCtrl.PUT = (req, res) => {
    const record = req.body;
    
    if (!record._id) {
        handleError({ res, err: 'req body err!', message: 'record _id is required' });
        return false;
    }

    delete todoId
    console.log(record)
    Record.findByIdAndUpdate(record._id, record, {new: true})
    .then(result => {
        handleSuccess({ res, result, message: 'change record success' });
    })
    .catch(err => {
        handleError({ res, err, message: 'change record err' });
    })
};

// delete record by _id
recordCtrl.DELETE = (req, res) => {
    const record = req.body;
    
    if (!record._id) {
        handleError({ res, err: 'req body err!', message: 'record _id is required' });
        return false;
    }
    
    // update todo.records
    Todo.update({records: {$in: [record._id]}}, {$pull: {records: record._id}})
    .catch(err => {
        handleError({ res, err, message: 'update todo.records err' })
    })

    Record.findByIdAndRemove(record._id)
    .then(result => {
        handleSuccess({ res, result: 'success', message: 'delete record success' });
    })
    .catch(err => {
        handleError({ res, err: '_id is\'t exist', message: 'delete record err' });
    })
};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: recordCtrl })};