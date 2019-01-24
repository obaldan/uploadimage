const multer = require('multer');
// path e cryto são bibliotecas do próprio node, logo não preciso instalar nada
const path = require('path');
const crypto = require('crypto');
// multer para comunicação com o s3
const multerS3 = require('multer-s3');
// aws-sdk é usado para acesso as APIs da Amazon  
const awssdk = require('aws-sdk');

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            // retorno o path para salvar
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            // gero 16 bytes aleatórios para compor o nome da imagem
            crypto.randomBytes(16, (err, hash) => {
                // se houver algum erro, retorno para o cb da função
                if (err) cb(err);

                // crio o filename transformando o hash para hexadecimal e concatenando com o nome original do arquivo
                file.key = `${hash.toString("hex")}-${file.originalname}`;

                cb(null, file.key);
            });
        }
    }),

    s3: multerS3({
        s3: new awssdk.S3(),
        bucket: 'uploadexampleimages',
        // ler o tipo do arquivo e atribuir como content-type do arquivo
        // o navegador vai entender o tipo do arquivo e vai abrir ao invés de fazer download
        contentType: multerS3.AUTO_CONTENT_TYPE,
        // permissões
        acl: 'public-read',
        key: (req, file, cb) => {
            // gero 16 bytes aleatórios para compor o nome da imagem
            crypto.randomBytes(16, (err, hash) => {
                // se houver algum erro, retorno para o cb da função
                if (err) cb(err);

                // crio o filename transformando o hash para hexadecimal e concatenando com o nome original do arquivo
                const filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, filename);
            });
        },
    }),
};


module.exports = {
    // destino da imagem
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),

    // configurações para salvar o arquivo
    storage: storageTypes[process.env.STORAGE_TYPE],

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

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },

};