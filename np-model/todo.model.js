/*
*
* todos数据模型
*
*/

const mongoose = require('np-mongodb').mongoose;

// todos模型
const todoSchema = new mongoose.Schema({

    title: { type: String, required: true },

    isDelete: { type: Boolean, default: false },

    locked: { type: Boolean, default: false },

    records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record'}]
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;