const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const {
    promisify
} = require('util');

const s3 = new aws.S3();

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

PostSchema.pre('save', function () {
    if (!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

PostSchema.pre('remove', function () {
    // sempre que for remover, verifico se o storage_type definido no .env é s3
    // depois utilizo o sdk da aws para deletar um objeto do bucket mencionado com a chave do arquivo.
    // o promisse irá esperar a AWS responder para continuar a execução do projeto
    if (process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: 'uploadexampleimages',
            Key: this.key
        }).promise()
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key));
    }

});

module.exports = mongoose.model('Post', PostSchema);