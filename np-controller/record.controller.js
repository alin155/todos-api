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
    
    const todoId = req.query._id;

    if (!todoId) {
        handleError({ res, err: 'req query err!', message: 'todo._id is required' });
    }
    
    Record.find({_id: todoId}, '-__v')
    .then(([record = {}]) => {
        handleSuccess({ res, result, message: 'get records success!' });
    })
    .catch(err => {
        handleError({ res, err, message: 'get records: jwt err!' });
    })
};

// add record by text and todo._id
recordCtrl.POST = (req, res) => {

    const record = req.body;
    
    if (!record.text || record.todoId) {
        handleError({ res, err: 'req body err!', message: 'record text is required' });
    }

};

// change record by _id
recordCtrl.PUT = (req, res) => {
    const record = req.body;
    
    if (!record._id) {
        handleError({ res, err: 'req body err!', message: 'record _id is required' });
    }

};

// delete record by _id
recordCtrl.DELETE = (req, res) => {
    const record = req.body;
    
    if (!record._id) {
        handleError({ res, err: 'req body err!', message: 'record _id is required' });
    }

};

// export
module.exports = (req, res) => { handleRequest({ req, res, controller: recordCtrl })};