const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    chapter: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    pages: {
        type: Array,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Chapter", ChapterSchema);