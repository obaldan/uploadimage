const express = require('express');
const morgan = require('morgan');

const app = express();

// express vai aceitar informações no formato json
app.use(express.json());

// express vai conseguir lidar com url no padrão encoded para facilitar envio de arquivos 
app.use(express.urlencoded({ extended: true }));

// morgan usado para logar requisições http no console
app.use(morgan('dev'));

app.use(require('./routes'));

app.listen('3000');
