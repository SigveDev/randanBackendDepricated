const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VidStatsSchema = new Schema({
    chapterId: {
        type: String,
        required: true,
        unique: true
    },
    views: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("VidStats", VidStatsSchema);