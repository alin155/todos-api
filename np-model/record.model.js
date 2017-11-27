/*
*
* record数据模型
*
*/

const mongoose = require('np-mongodb').mongoose;

// todos模型
const recordSchema = new mongoose.Schema({
    
    todo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}],

    text: { type: String, required: true },

    isDelete: { type: Boolean, default: false },

    checked: { type: Boolean, default: false }
});

const Record = mongoose.model('Record', recordSchema);
module.exports = Record;