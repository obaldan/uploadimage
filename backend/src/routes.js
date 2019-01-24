const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

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



module.exports = routes;