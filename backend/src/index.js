require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

/**
 * Database setup
 */
mongoose.connect(process.env.URL_MONGO, {
    useNewUrlParser: true
});

// express vai aceitar informações no formato json
app.use(express.json());

// express vai conseguir lidar com url no padrão encoded para facilitar envio de arquivos 
app.use(express.urlencoded({
    extended: true
}));

// morgan usado para logar requisições http no console
app.use(morgan('dev'));

app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

app.use(require('./routes'));

app.listen('3000');