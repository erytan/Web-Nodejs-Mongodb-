const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    munberViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisLiked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    disLikes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    images: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJA8LE-4lJ70o2TfGSZd5vbHeDC_-sn6KfGQ&usqp=CAU"
    },
    author: {
        type: String,
        default: "Admin",
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);