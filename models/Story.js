const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    rating: {
        type: String,
        required: true,
    },
    friends: {
        type: Boolean,
        default: false,
    },
    story: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: "untitled",
        trim: true,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    cloudinaryId: {
        type: String,
        require: true,
    },
    public: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Story', StorySchema)