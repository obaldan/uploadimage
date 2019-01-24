const multer = require('multer');
// path e cryto são bibliotecas do próprio node, logo não preciso instalar nada
const path = require('path');
const crypto = require('crypto');

module.exports = { 
    // destino da imagem
    dest : path.resolve(__dirname, '..','..','tmp','uploads'),
    
    // configurações para salvar o arquivo
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // retorno o path para salvar
            cb(null, path.resolve(__dirname, '..','..','tmp','uploads'));
        },
        filename: (req, file, cb) => {
            // gero 16 bytes aleatórios para compor o nome da imagem
            crypto.randomBytes(16, (err, hash) => {
                // se houver algum erro, retorno para o cb da função
                if(err) cb(err);

                // crio o filename transformando o hash para hexadecimal e concatenando com o nome original do arquivo
                const filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            })
        }
    }),

    // define padrões e limites para o upload de arquivos
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 mb
    },
    // define somente os arquivos que serão aceitos
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            
        ];

        if (allowedMimes.includes(file.mimetype)){
            cb(null,true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },

};