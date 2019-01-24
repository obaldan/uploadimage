const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const Post = require('./models/Post');

routes.get('/ping', (req, res) => {
    return res.json({
        hello: 'teste'
    });
});

// nas rotas podemos especificar os middlewares, nessa caso especifico o multer
// o multer será responsável por fazer o upload de arquivos
// se uso o método single, ele irá fazer o upload de um arquivo por vez
// já o método array, fará o upload de múltiplos arquivos
routes.post('/posts', multer(multerConfig).single('file'), (req, res) => {
    console.log(req.file);

    return res.json({
        hello: 'teste'
    });
});

routes.post('/postsTest', multer(multerConfig).single('file'), async (req, res) => {
    const {
        originalname: name,
        size,
        filename: key
    } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url: ''
    });

    console.log(post);
    return res.json(post);
});

routes.post('/postsS3', multer(multerConfig).single('file'), async (req, res) => {
    const {
        originalname: name,
        size,
        key,
        location: url
    } = req.file;

    const post = await Post.create({
        name,
        size,
        key,
        url
    });
    console.log(post);
    return res.json(post);
});

routes.get('/posts', async (req, res) => {
    const posts = await Post.find();

    return res.json(posts);
});

routes.delete('/posts/:id', async (req, res) => {
    const posts = await Post.findById(req.params.id);
    await posts.remove();

    return res.json('Post deletado');
});

module.exports = routes;