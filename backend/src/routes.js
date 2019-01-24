const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const Post = require('./models/Post');

routes.get('/ping', (req, res) => {
    return res.json({ hello: 'teste'});
});

// nas rotas podemos especificar os middlewares, nessa caso especifico o multer
// o multer será responsável por fazer o upload de arquivos
// se uso o método single, ele irá fazer o upload de um arquivo por vez
// já o método array, fará o upload de múltiplos arquivos
routes.post('/posts', multer(multerConfig).single('file'), (req, res) => {
    console.log(req.file);

    return res.json({ hello: 'teste'});
});


routes.post('/postsTest', multer(multerConfig).single('file'), async (req, res) => {
    const { originalname: name, size, filename : key} = req.file;
    
    const post = await Post.create({ 
        name,
        size,
        key,
        url: 'localstorage',
    });

    return res.json(post);
});


module.exports = routes;