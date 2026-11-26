const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitsHistory: [{timestamp: {type: Number}}],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    }
  },{timestamps: true}
);

const URL = mongoose.model('URL', urlSchema);

module.exports =URL;