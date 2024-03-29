// Importações de constantes do app
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Importa as rotas
const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');

// Imprime no console a requisição
app.use(morgan('dev'));

// Configura a API para aceitar JSON
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

// Configura alguns HEADERS da API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // Retorna os métodos que a API aceita ao enviar um OPTIONS
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
});

// Mapeia as rotas
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

// Configura o erro 404 quando não encontrar a rota
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

// Configura outros erros e o erro 500
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;