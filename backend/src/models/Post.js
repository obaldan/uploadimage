const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    name: String, // nome original
    size: Number,
    key: String, // nome gerado com o hash
    url: String, // caminho no S3
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', PostSchema);