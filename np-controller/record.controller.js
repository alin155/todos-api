/*
*
* record控制器
*
*/

const { handleRequest, handleError, handleSuccess } = require('np-utils/np-handle');
const Record = require('np-model/record.model');
const config = require('np-config');
const jwt = require('jsonwebtoken');
const recordCtrl = {};


// export
module.exports = (req, res) => { handleRequest({ req, res, controller: recordCtrl })};